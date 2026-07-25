#!/usr/bin/env bash
#
# init-production-db.sh
#
# One-time (but safe to re-run) helper to initialize the production database.
#
# It applies all pending Prisma migrations and seeds the database with the
# demo accounts required for login testing. Both steps are idempotent:
#   - `prisma migrate deploy` only applies migrations that have not already
#     been applied, and is a no-op if the database is already up to date.
#   - `npm run db:seed` upserts the demo users/roles/permissions, so running
#     it multiple times will not create duplicate records.
#
# Usage:
#   npm run db:init-production
#
# Requires DATABASE_URL (and any other env vars used by the Prisma schema)
# to be set in the environment before running.

set -euo pipefail

echo "==> Starting production database initialization..."

echo "==> Applying Prisma migrations..."
if npx prisma migrate deploy --schema=database/prisma/schema.prisma; then
  echo "==> Migrations applied successfully."
else
  echo "==> ERROR: Failed to apply Prisma migrations." >&2
  exit 1
fi

echo "==> Seeding database with demo data..."
if npm run db:seed; then
  echo "==> Database seeded successfully."
else
  echo "==> ERROR: Failed to seed the database." >&2
  exit 1
fi

echo "==> Production database initialization complete."
