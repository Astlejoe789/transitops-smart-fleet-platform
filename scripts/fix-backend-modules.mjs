/**
 * Script to fix unused imports in backend module scaffolds.
 * Run: node scripts/fix-backend-modules.mjs
 */
import { writeFileSync } from 'fs';
import { join } from 'path';

const MODULES_DIR = join(import.meta.dirname, '..', 'apps', 'api', 'src', 'modules');

const MODULE_NAMES = [
  'auth', 'dashboard', 'fleet', 'drivers', 'trips', 'maintenance',
  'fuel', 'expenses', 'billing', 'payments', 'customers', 'vendors',
  'reports', 'analytics', 'ai', 'notifications', 'administration', 'settings',
];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function pascalCase(str) {
  return str.split(/[-_]/).map(capitalize).join('');
}

for (const moduleName of MODULE_NAMES) {
  const moduleDir = join(MODULES_DIR, moduleName);
  const pascal = pascalCase(moduleName);

  // controller.ts — remove unused import
  writeFileSync(join(moduleDir, 'controller.ts'), `/**
 * ${pascal} Controller
 *
 * Handles HTTP requests for the ${moduleName} module.
 * Keep controllers thin — delegate logic to the service layer.
 */
export class ${pascal}Controller {
  // TODO: Implement controller methods
}
`, 'utf-8');

  // repository.ts — remove unused import
  writeFileSync(join(moduleDir, 'repository.ts'), `// import { prisma } from '../../database/prisma.js';

/**
 * ${pascal} Repository
 *
 * Data access layer for the ${moduleName} module.
 * All database queries should go through this class.
 */
export class ${pascal}Repository {
  // TODO: Implement repository methods using Prisma
}
`, 'utf-8');

  // validation.ts — remove unused import
  writeFileSync(join(moduleDir, 'validation.ts'), `// import { z } from 'zod';

/**
 * ${pascal} Validation Schemas
 *
 * Zod schemas for request validation in the ${moduleName} module.
 */

// Example:
// export const create${pascal}Schema = z.object({
//   name: z.string().min(1),
// });

export {};
`, 'utf-8');

  console.log(`✅ Fixed module: ${moduleName}`);
}

console.log(`\n🎉 All ${MODULE_NAMES.length} backend modules fixed!`);
