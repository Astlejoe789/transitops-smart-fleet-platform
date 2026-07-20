/**
 * Script to generate all 18 frontend feature module scaffolds.
 * Run: node scripts/generate-frontend-modules.mjs
 */
import { mkdirSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

const MODULES_DIR = join(import.meta.dirname, '..', 'apps', 'web', 'src', 'modules');

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

const SUBDIRS = ['pages', 'components', 'hooks', 'services', 'schemas', 'types', 'constants', 'utils'];

function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

for (const moduleName of MODULE_NAMES) {
  const moduleDir = join(MODULES_DIR, moduleName);

  // Create module directory
  mkdirSync(moduleDir, { recursive: true });

  // Create subdirectories with barrel index.ts
  for (const subdir of SUBDIRS) {
    const subdirPath = join(moduleDir, subdir);
    mkdirSync(subdirPath, { recursive: true });

    const indexPath = join(subdirPath, 'index.ts');
    if (!existsSync(indexPath)) {
      writeFileSync(
        indexPath,
        `/**\n * ${capitalize(moduleName)} module — ${subdir}\n */\nexport {};\n`,
        'utf-8',
      );
    }
  }

  // Create module barrel index.ts
  const moduleIndexPath = join(moduleDir, 'index.ts');
  if (!existsSync(moduleIndexPath)) {
    const exportLines = SUBDIRS.map(
      (subdir) => `// export * from './${subdir}';`,
    ).join('\n');

    writeFileSync(
      moduleIndexPath,
      `/**\n * ${capitalize(moduleName)} Module\n *\n * Feature module for ${moduleName} functionality.\n * Uncomment exports as features are implemented.\n */\n\n${exportLines}\n`,
      'utf-8',
    );
  }

  console.log(`✅ Created module: ${moduleName}`);
}

console.log(`\n🎉 All ${MODULE_NAMES.length} frontend modules generated!`);
