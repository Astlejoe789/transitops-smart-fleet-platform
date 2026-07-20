/**
 * Database seed script for TransitOps.
 *
 * Populates system permissions, default roles, role-permissions junction,
 * and demo company/branch/users for development and testing.
 *
 * Run: npm run db:seed
 */
import { PrismaClient, UserRole } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const PERMISSIONS = [
  // User & Organization Management
  { module: 'users', action: 'read', description: 'View user accounts' },
  { module: 'users', action: 'write', description: 'Create and update user accounts' },
  { module: 'users', action: 'delete', description: 'Delete user accounts' },

  // Fleet Management
  { module: 'fleet', action: 'read', description: 'View vehicles and fleet status' },
  { module: 'fleet', action: 'write', description: 'Add and update vehicles' },
  { module: 'fleet', action: 'delete', description: 'Decommission vehicles' },

  // Driver Management
  { module: 'drivers', action: 'read', description: 'View driver profiles and licenses' },
  { module: 'drivers', action: 'write', description: 'Create and update driver profiles' },
  { module: 'drivers', action: 'delete', description: 'Remove drivers' },

  // Trip Operations
  { module: 'trips', action: 'read', description: 'View dispatch and trip details' },
  { module: 'trips', action: 'write', description: 'Schedule and dispatch trips' },
  { module: 'trips', action: 'cancel', description: 'Cancel active or scheduled trips' },

  // Maintenance
  { module: 'maintenance', action: 'read', description: 'View maintenance logs' },
  { module: 'maintenance', action: 'write', description: 'Log and schedule maintenance' },

  // Fuel & Expenses
  { module: 'fuel', action: 'read', description: 'View fuel logs' },
  { module: 'fuel', action: 'write', description: 'Log fuel transactions' },
  { module: 'expenses', action: 'read', description: 'View company expenses' },
  { module: 'expenses', action: 'write', description: 'Submit and approve expenses' },

  // Billing & Invoicing
  { module: 'billing', action: 'read', description: 'View customer invoices and payments' },
  { module: 'billing', action: 'write', description: 'Generate invoices and record payments' },

  // Customers & Vendors
  { module: 'customers', action: 'read', description: 'View customer CRM details' },
  { module: 'customers', action: 'write', description: 'Manage customer accounts' },
  { module: 'vendors', action: 'read', description: 'View service vendor records' },
  { module: 'vendors', action: 'write', description: 'Manage vendor accounts' },

  // Reports & Analytics
  { module: 'reports', action: 'read', description: 'View and export operational reports' },
  { module: 'analytics', action: 'read', description: 'View analytics dashboards and AI insights' },

  // Settings & System
  { module: 'settings', action: 'manage', description: 'Configure company settings' },
];

async function main() {
  console.log('🌱 Starting TransitOps database seed...');

  // 1. Seed Permissions
  console.log('📦 Seeding permissions...');
  const createdPermissions = [];
  for (const perm of PERMISSIONS) {
    const permission = await prisma.permission.upsert({
      where: {
        module_action: { module: perm.module, action: perm.action },
      },
      update: { description: perm.description },
      create: perm,
    });
    createdPermissions.push(permission);
  }
  console.log(`✅ Seeded ${createdPermissions.length} permissions.`);

  // Helper map for permission lookups
  const permMap = new Map(
    createdPermissions.map((p) => [`${p.module}:${p.action}`, p.id]),
  );

  // 2. Seed System Roles & Attach Permissions
  console.log('🛡️ Seeding system roles...');
  const rolesToCreate = [
    {
      name: UserRole.SUPER_ADMIN,
      description: 'Full platform administration access',
      permissions: Array.from(permMap.values()),
    },
    {
      name: UserRole.COMPANY_ADMIN,
      description: 'Company-level administrator',
      permissions: Array.from(permMap.values()),
    },
    {
      name: UserRole.BRANCH_MANAGER,
      description: 'Branch-level operational manager',
      permissions: [
        'users:read', 'fleet:read', 'drivers:read', 'drivers:write',
        'trips:read', 'trips:write', 'maintenance:read', 'fuel:read',
        'expenses:read', 'reports:read',
      ].map((k) => permMap.get(k)!).filter(Boolean),
    },
    {
      name: UserRole.FLEET_MANAGER,
      description: 'Fleet & maintenance manager',
      permissions: [
        'fleet:read', 'fleet:write', 'drivers:read', 'maintenance:read',
        'maintenance:write', 'fuel:read', 'fuel:write', 'expenses:read', 'reports:read',
      ].map((k) => permMap.get(k)!).filter(Boolean),
    },
    {
      name: UserRole.DISPATCHER,
      description: 'Trip dispatcher and logistics planner',
      permissions: [
        'fleet:read', 'drivers:read', 'trips:read', 'trips:write',
        'trips:cancel', 'customers:read', 'reports:read',
      ].map((k) => permMap.get(k)!).filter(Boolean),
    },
    {
      name: UserRole.DRIVER,
      description: 'Driver operational mobile access',
      permissions: [
        'trips:read', 'fuel:read', 'fuel:write', 'expenses:read', 'expenses:write',
      ].map((k) => permMap.get(k)!).filter(Boolean),
    },
    {
      name: UserRole.FINANCE_MANAGER,
      description: 'Financial manager for billing and expenses',
      permissions: [
        'expenses:read', 'expenses:write', 'billing:read', 'billing:write',
        'customers:read', 'vendors:read', 'reports:read',
      ].map((k) => permMap.get(k)!).filter(Boolean),
    },
    {
      name: UserRole.VIEWER,
      description: 'Read-only view access',
      permissions: [
        'fleet:read', 'drivers:read', 'trips:read', 'reports:read', 'analytics:read',
      ].map((k) => permMap.get(k)!).filter(Boolean),
    },
  ];

  const roleEntities: Record<string, string> = {};

  for (const roleDef of rolesToCreate) {
    let role = await prisma.role.findFirst({
      where: { name: roleDef.name, companyId: null },
    });

    if (!role) {
      role = await prisma.role.create({
        data: {
          name: roleDef.name,
          description: roleDef.description,
          isSystem: true,
          companyId: null,
        },
      });
    }

    roleEntities[roleDef.name] = role.id;

    // Attach role permissions
    for (const permId of roleDef.permissions) {
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permId,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permId,
        },
      });
    }
  }
  console.log(`✅ Seeded ${Object.keys(roleEntities).length} default roles with permissions.`);

  // 3. Seed Demo Company
  console.log('🏢 Seeding demo company...');
  const company = await prisma.company.upsert({
    where: { code: 'TOL-001' },
    update: {},
    create: {
      name: 'TransitOps Logistics Ltd.',
      code: 'TOL-001',
      email: 'contact@transitops-demo.com',
      phone: '+1 (555) 019-2834',
      address: '100 Logistics Way, Suite 400, New York, NY 10001',
      taxId: 'US-987654321',
      isVerified: true,
      isActive: true,
    },
  });

  // 4. Seed Demo Branch
  console.log('📍 Seeding demo branch...');
  const branch = await prisma.branch.upsert({
    where: {
      companyId_code: {
        companyId: company.id,
        code: 'HQ-NY',
      },
    },
    update: {},
    create: {
      companyId: company.id,
      name: 'HQ Depot - New York',
      code: 'HQ-NY',
      phone: '+1 (555) 019-2835',
      address: '100 Logistics Way, New York, NY 10001',
      isActive: true,
    },
  });

  // 5. Seed Demo Users
  console.log('👤 Seeding demo users...');
  const defaultPassword = await bcrypt.hash('Admin@123456', 10);
  const fleetPassword = await bcrypt.hash('Fleet@123456', 10);
  const dispatchPassword = await bcrypt.hash('Dispatch@123456', 10);

  const demoUsers = [
    {
      email: 'admin@transitops.com',
      passwordHash: defaultPassword,
      firstName: 'Alex',
      lastName: 'Morgan',
      roleId: roleEntities[UserRole.COMPANY_ADMIN],
      phone: '+1 (555) 100-0001',
    },
    {
      email: 'fleet@transitops.com',
      passwordHash: fleetPassword,
      firstName: 'Sarah',
      lastName: 'Jenkins',
      roleId: roleEntities[UserRole.FLEET_MANAGER],
      phone: '+1 (555) 100-0002',
    },
    {
      email: 'dispatcher@transitops.com',
      passwordHash: dispatchPassword,
      firstName: 'Marcus',
      lastName: 'Vance',
      roleId: roleEntities[UserRole.DISPATCHER],
      phone: '+1 (555) 100-0003',
    },
  ];

  for (const u of demoUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {
        companyId: company.id,
        branchId: branch.id,
        roleId: u.roleId,
        passwordHash: u.passwordHash,
      },
      create: {
        companyId: company.id,
        branchId: branch.id,
        roleId: u.roleId,
        email: u.email,
        passwordHash: u.passwordHash,
        firstName: u.firstName,
        lastName: u.lastName,
        phone: u.phone,
      },
    });
  }

  console.log('✅ Demo users seeded successfully!');
  console.log('\n=============================================');
  console.log('🔑 Demo Credentials:');
  console.log('   Company Admin: admin@transitops.com / Admin@123456');
  console.log('   Fleet Manager: fleet@transitops.com / Fleet@123456');
  console.log('   Dispatcher:    dispatcher@transitops.com / Dispatch@123456');
  console.log('=============================================\n');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
