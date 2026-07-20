/**
 * Script to generate all 18 backend feature module scaffolds.
 * Run: node scripts/generate-backend-modules.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const MODULES_DIR = join(import.meta.dirname, '..', 'apps', 'api', 'src', 'modules');

const MODULE_NAMES = [
  'auth',
  'dashboard',
  'fleet',
  'drivers',
  'trips',
  'maintenance',
  'fuel',
  'expenses',
  'billing',
  'payments',
  'customers',
  'vendors',
  'reports',
  'analytics',
  'ai',
  'notifications',
  'administration',
  'settings',
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

  mkdirSync(moduleDir, { recursive: true });

  // controller.ts
  const controllerPath = join(moduleDir, 'controller.ts');
  if (!existsSync(controllerPath)) {
    writeFileSync(controllerPath, `import type { Request, Response } from 'express';

/**
 * ${pascal} Controller
 *
 * Handles HTTP requests for the ${moduleName} module.
 * Keep controllers thin — delegate logic to the service layer.
 */
export class ${pascal}Controller {
  // TODO: Implement controller methods
}
`, 'utf-8');
  }

  // service.ts
  const servicePath = join(moduleDir, 'service.ts');
  if (!existsSync(servicePath)) {
    writeFileSync(servicePath, `/**
 * ${pascal} Service
 *
 * Business logic for the ${moduleName} module.
 */
export class ${pascal}Service {
  // TODO: Implement service methods
}
`, 'utf-8');
  }

  // repository.ts
  const repoPath = join(moduleDir, 'repository.ts');
  if (!existsSync(repoPath)) {
    writeFileSync(repoPath, `import { prisma } from '../../database/prisma.js';

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
  }

  // routes.ts
  const routesPath = join(moduleDir, 'routes.ts');
  if (!existsSync(routesPath)) {
    writeFileSync(routesPath, `import { Router } from 'express';

/**
 * ${pascal} Routes
 *
 * Define API endpoints for the ${moduleName} module.
 */
const router = Router();

// TODO: Add route definitions
// Example:
// router.get('/', controller.getAll);
// router.get('/:id', controller.getById);
// router.post('/', validate(createSchema), controller.create);
// router.put('/:id', validate(updateSchema), controller.update);
// router.delete('/:id', controller.delete);

export const ${moduleName}Routes = router;
`, 'utf-8');
  }

  // validation.ts
  const validationPath = join(moduleDir, 'validation.ts');
  if (!existsSync(validationPath)) {
    writeFileSync(validationPath, `import { z } from 'zod';

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
  }

  // dto.ts
  const dtoPath = join(moduleDir, 'dto.ts');
  if (!existsSync(dtoPath)) {
    writeFileSync(dtoPath, `/**
 * ${pascal} Data Transfer Objects
 *
 * Shapes for API request/response payloads in the ${moduleName} module.
 */

// Example:
// export interface Create${pascal}Dto {
//   name: string;
// }
//
// export interface Update${pascal}Dto {
//   name?: string;
// }

export {};
`, 'utf-8');
  }

  // types.ts
  const typesPath = join(moduleDir, 'types.ts');
  if (!existsSync(typesPath)) {
    writeFileSync(typesPath, `/**
 * ${pascal} Types
 *
 * Module-specific TypeScript types and interfaces.
 */
export {};
`, 'utf-8');
  }

  // constants.ts
  const constantsPath = join(moduleDir, 'constants.ts');
  if (!existsSync(constantsPath)) {
    writeFileSync(constantsPath, `/**
 * ${pascal} Constants
 *
 * Module-specific constants for the ${moduleName} module.
 */
export {};
`, 'utf-8');
  }

  // index.ts (barrel)
  const indexPath = join(moduleDir, 'index.ts');
  if (!existsSync(indexPath)) {
    writeFileSync(indexPath, `/**
 * ${pascal} Module
 *
 * Barrel exports for the ${moduleName} feature module.
 * Uncomment exports as features are implemented.
 */

// export { ${pascal}Controller } from './controller.js';
// export { ${pascal}Service } from './service.js';
// export { ${pascal}Repository } from './repository.js';
// export { ${moduleName}Routes } from './routes.js';
`, 'utf-8');
  }

  console.log(`✅ Created module: ${moduleName}`);
}

console.log(`\n🎉 All ${MODULE_NAMES.length} backend modules generated!`);
