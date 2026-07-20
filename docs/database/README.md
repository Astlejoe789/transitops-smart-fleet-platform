# TransitOps Database Architecture Documentation

## Overview

TransitOps uses **PostgreSQL** as its relational database management system, managed via **Prisma ORM**. The schema is engineered for high-concurrency multi-tenant operations, strict data isolation, full auditability, and historical tracking.

- **Schema File**: [database/prisma/schema.prisma](file:///c:/Users/astle/Documents/TransitOps/database/prisma/schema.prisma)
- **Primary Keys**: Universally Unique Identifiers (UUID v4)
- **Multi-Tenancy**: Isolated by `Company` (Tenant) and optional `Branch` scoping
- **Soft Deletion**: Implemented via indexed `deletedAt DateTime?` columns on core operational entities

---

## 1. Entity Descriptions & Model Overview

| Entity | Table Name | Purpose & Business Scope | Soft Delete | Multi-Tenant Scoped |
| :--- | :--- | :--- | :---: | :---: |
| **Company** | `companies` | Root tenant entity representing the logistics/transport firm. | Yes | Root Tenant |
| **Branch** | `branches` | Physical depot or regional office operating under a Company. | Yes | Yes (`companyId`) |
| **Role** | `roles` | System and company-defined RBAC roles. | No | System / `companyId` |
| **Permission** | `permissions` | Granular action permissions (`module:action` pair). | No | Global Reference |
| **RolePermission** | `role_permissions` | Junction table for Role-Permission assignment. | No | Direct Join |
| **User** | `users` | Authenticated system user account. | Yes | `companyId`, `branchId` |
| **Vehicle** | `vehicles` | Fleet vehicle assets (trucks, vans, trailers, etc.). | Yes | `companyId`, `branchId` |
| **VehicleDocument** | `vehicle_documents` | Vehicle registrations, permits, insurance policies. | No | Via `Vehicle` |
| **Driver** | `drivers` | Driver profiles linked 1-to-1 with a User account. | Yes | `companyId`, `branchId` |
| **DriverDocument** | `driver_documents` | Licenses, medical certificates, training records. | No | Via `Driver` |
| **Trip** | `trips` | Transport assignments linking Driver, Vehicle, Route & Customer. | Yes | `companyId`, `branchId` |
| **MaintenanceLog** | `maintenance_logs` | Service, inspection, and repair logs for vehicles. | No | `companyId` |
| **FuelLog** | `fuel_logs` | Refueling records with odometer readings and fuel costs. | No | `companyId` |
| **Expense** | `expenses` | Operational expenses (tolls, allowances, repairs, fuel). | No | `companyId`, `branchId` |
| **Customer** | `customers` | Freight client accounts ordering transport services. | Yes | `companyId` |
| **Vendor** | `vendors` | Service providers, workshops, and fuel suppliers. | Yes | `companyId` |
| **Invoice** | `invoices` | Billing statements generated for customers. | Yes | `companyId`, `branchId` |
| **InvoiceItem** | `invoice_items` | Line items detailing services/charges on an Invoice. | No | Via `Invoice` |
| **Payment** | `payments` | Customer payment receipts linked to Invoices. | No | `companyId` |
| **Notification** | `notifications` | In-app alerts for users (expiries, assignments, warnings). | No | `companyId` |
| **AuditLog** | `audit_logs` | Security and compliance audit trailing with JSON diffs. | No | `companyId` |
| **Setting** | `settings` | Key-value JSON configuration scoped per Company. | No | `companyId` |

---

## 2. Reusable Enums

The schema uses strongly-typed PostgreSQL enums to eliminate string magic numbers and ensure strict data integrity:

```prisma
UserRole              { SUPER_ADMIN, COMPANY_ADMIN, BRANCH_MANAGER, FLEET_MANAGER, DISPATCHER, DRIVER, FINANCE_MANAGER, VIEWER }
UserStatus            { ACTIVE, INACTIVE, SUSPENDED, PENDING_VERIFICATION }
VehicleStatus         { AVAILABLE, IN_TRANSIT, UNDER_MAINTENANCE, OUT_OF_SERVICE, DECOMMISSIONED }
VehicleType           { TRUCK, VAN, TRAILER, BUS, PICKUP, CONTAINER_CARRIER }
FuelType              { DIESEL, PETROL, ELECTRIC, HYBRID, CNG }
DriverStatus          { AVAILABLE, ON_TRIP, ON_LEAVE, SUSPENDED, TERMINATED }
LicenseCategory       { CLASS_A, CLASS_B, CLASS_C, CLASS_D, HEAVY_RIGID, COMBINATION }
TripStatus            { SCHEDULED, DISPATCHED, IN_PROGRESS, COMPLETED, CANCELLED, DELAYED }
TripPriority          { LOW, MEDIUM, HIGH, URGENT }
MaintenanceStatus     { SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED }
MaintenanceType       { ROUTINE_SERVICE, REPAIR, INSPECTION, TIRE_CHANGE, OIL_CHANGE, BREAKDOWN }
ExpenseCategory       { FUEL, MAINTENANCE, TOLL, PARKING, DRIVER_ALLOWANCE, PERMIT, INSURANCE, OTHER }
InvoiceStatus         { DRAFT, ISSUED, PARTIALLY_PAID, PAID, OVERDUE, VOID, CANCELLED }
PaymentStatus         { PENDING, COMPLETED, FAILED, REFUNDED }
PaymentMethod         { BANK_TRANSFER, CREDIT_CARD, CASH, CHECK, DIGITAL_WALLET }
NotificationType      { TRIP_ASSIGNED, MAINTENANCE_DUE, LICENSE_EXPIRING, INVOICE_OVERDUE, EXPENSE_ALERT, SYSTEM }
NotificationSeverity  { INFO, WARNING, CRITICAL }
AuditAction           { CREATE, UPDATE, DELETE, LOGIN, EXPORT }
```

---

## 3. Relationship Matrix & Cascade Delete Rules

To preserve financial records and audit integrity, strict referential integrity rules are configured:

| Parent Entity | Child Entity | Relationship Type | Referential Action (`onDelete`) | Rationale |
| :--- | :--- | :---: | :---: | :--- |
| **Company** | `Branch`, `User`, `Vehicle`, `Driver`, `Trip`, `Customer`, `Vendor`, `Invoice`, `Expense`, etc. | 1-to-Many | `Cascade` | Deleting a tenant purges all tenant-owned entities. |
| **Branch** | `User`, `Vehicle`, `Driver`, `Trip`, `Expense`, `Invoice` | 1-to-Many | `SetNull` | Preserves vehicles/drivers if a branch is closed. |
| **Role** | `User` | 1-to-Many | `Restrict` | Prevents deleting a role assigned to active users. |
| **User** | `Driver` | 1-to-1 | `Cascade` | Deleting user removes corresponding driver profile. |
| **Vehicle** | `Trip`, `FuelLog`, `MaintenanceLog` | 1-to-Many | `Restrict` / `Cascade` | `Restrict` on Trips prevents orphan trip history; `Cascade` on child logs. |
| **Driver** | `Trip`, `FuelLog` | 1-to-Many | `Restrict` | Prevents deleting a driver with trip history. |
| **Customer** | `Invoice`, `Trip` | 1-to-Many | `Restrict` | Financial compliance — cannot delete billed customers. |
| **Invoice** | `InvoiceItem`, `Payment` | 1-to-Many | `Cascade` | Line items and payment records attach strictly to invoice lifecycle. |
| **User** | `AuditLog`, `Notification` | 1-to-Many | `SetNull` / `Cascade` | Preserves audit trails even if user is removed. |

---

## 4. Indexing Strategy & Performance Tuning

High-frequency query patterns are indexed to ensure sub-millisecond response times:

### Single-Column & Filter Indexes
- `@@index([companyId])`: Applied to **all tenant models** for multi-tenant query filtering.
- `@@index([deletedAt])`: Applied to all soft-deletable models to speed up `WHERE deletedAt IS NULL` filters.
- `@@index([status])`: Indexed on `vehicles`, `drivers`, `trips`, `invoices`, and `maintenance_logs` for real-time status dashboards.
- `@@index([scheduledStart])`, `@@index([expenseDate])`, `@@index([fuelDate])`: Range query indexing for date-based filtering and analytics reports.

### Composite Indexes
- `@@index([entityType, entityId])` on `audit_logs`: Optimizes compliance tracking queries for specific entity history.
- `@@unique([companyId, code])` on `branches`: Enforces tenant-level uniqueness for branch codes.
- `@@unique([companyId, email])` on `customers`: Enforces tenant-level customer email uniqueness.
- `@@unique([companyId, category, key])` on `settings`: Rapid key-value lookups for company settings.

---

## 5. Future Scalability Recommendations

1. **Database Partitioning**:
   - As `audit_logs`, `fuel_logs`, and `notifications` grow past tens of millions of rows, implement **range partitioning by date** (`createdAt` / `fuelDate`).
2. **Read-Replica Offloading**:
   - Analytics, Reports, and AI Insights queries can be routed to PostgreSQL read replicas using Prisma's read replica extension.
3. **Cold Data Archival**:
   - Soft-deleted rows (`deletedAt IS NOT NULL`) older than 2 years can be archived to cold storage (e.g. AWS S3 / Parquet files) to keep PostgreSQL indexes compact.
