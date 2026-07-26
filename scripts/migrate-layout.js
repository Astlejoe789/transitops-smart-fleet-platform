const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, '../apps/web/src/modules');
const commonDir = path.join(__dirname, '../apps/web/src/components');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let hasChanges = false;

  // We want to replace `<div className="space-y-something">` with `<PageContainer className="space-y-something">`
  // But only the top-level one right after `return (`. We can use a regex for this.
  const returnRegex = /return\s*\(\s*<div\s+className="([^"]*(?:space-y|p-6|max-w)[^"]*)"\s*>/;
  const match = content.match(returnRegex);
  
  if (match) {
    const className = match[1];
    // Simple naive replacement for the first one
    content = content.replace(returnRegex, `return (\n    <PageContainer className="${className}">`);
    // And we also have to replace the last `</div>` inside the return. 
    // Since we don't have a full AST parser easily, let's just do a reverse search.
    const lastDivIdx = content.lastIndexOf('</div>\n  );');
    if (lastDivIdx !== -1) {
      content = content.slice(0, lastDivIdx) + '</PageContainer>\n  );' + content.slice(lastDivIdx + 12);
      hasChanges = true;
    } else {
      const lastDivIdx2 = content.lastIndexOf('</div>\n    );\n'); // for with provider wrappers?
      if (lastDivIdx2 !== -1) {
        content = content.slice(0, lastDivIdx2) + '</PageContainer>\n    );\n' + content.slice(lastDivIdx2 + 15);
        hasChanges = true;
      }
    }
  }

  // Now replace the header part.
  const headerRegex = /<div className="[^"]*flex[^"]*items-center[^"]*justify-between[^"]*">\s*(?:<div>\s*)?<PageTitle>([^<]+)<\/PageTitle>\s*(?:<PageSubtitle>([^<]+)<\/PageSubtitle>\s*)?(?:<\/div>\s*)?(?:<div className="flex[^"]*">([\s\S]*?)<\/div>\s*)?<\/div>/;
  
  const headerMatch = content.match(headerRegex);
  if (headerMatch && hasChanges) {
    const title = headerMatch[1].trim();
    const subtitle = headerMatch[2] ? headerMatch[2].trim() : '';
    const actions = headerMatch[3] ? headerMatch[3].trim() : '';

    let replacement = `<PageHeader \n        title="${title}"`;
    if (subtitle) {
      replacement += `\n        subtitle="${subtitle}"`;
    }
    if (actions) {
      replacement += `\n        actions={\n          <>\n            ${actions.replace(/\n/g, '\n            ')}\n          </>\n        }`;
    }
    replacement += `\n      />`;

    content = content.replace(headerMatch[0], replacement);
  }

  if (hasChanges) {
    // Add imports
    if (!content.includes('PageContainer')) {
      // Find the last import
      const lastImportIdx = content.lastIndexOf('import ');
      if (lastImportIdx !== -1) {
        const nextLineIdx = content.indexOf('\n', lastImportIdx) + 1;
        content = content.slice(0, nextLineIdx) + "import { PageContainer, PageHeader } from '@/components/layout';\n" + content.slice(nextLineIdx);
      }
    }

    // Remove PageTitle, PageSubtitle if no longer used
    if (!content.includes('<PageTitle>')) {
      content = content.replace(/import \{[^}]*PageTitle[^}]*\} from '@\/components\/ui\/Typography';\n?/, '');
    }

    fs.writeFileSync(filePath, content);
    console.log(`Updated ${filePath}`);
  }
}

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      walkDir(filePath);
    } else if (filePath.endsWith('.tsx')) {
      processFile(filePath);
    }
  }
}

walkDir(srcDir);
// Also process placeholder page
processFile(path.join(commonDir, 'common/ModulePlaceholderPage.tsx'));
