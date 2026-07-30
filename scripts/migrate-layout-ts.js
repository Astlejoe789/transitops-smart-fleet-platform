const { Project, SyntaxKind } = require('ts-morph');
const fs = require('fs');

const project = new Project();
project.addSourceFilesAtPaths("apps/web/src/modules/*/pages/*.tsx");

const files = project.getSourceFiles();

for (const sourceFile of files) {
  let hasChanges = false;
  const changedImports = false;

  const returnStatements = sourceFile.getDescendantsOfKind(SyntaxKind.ReturnStatement);
  for (const returnStmt of returnStatements) {
    const parentFunc = returnStmt.getFirstAncestorByKind(SyntaxKind.FunctionDeclaration) || returnStmt.getFirstAncestorByKind(SyntaxKind.ArrowFunction);
    
    // Make sure we're in the default export function (the page)
    if (parentFunc && ((parentFunc.isExported && parentFunc.isExported()) || (parentFunc.isDefaultExport && parentFunc.isDefaultExport()) || parentFunc.getParent()?.isKind(SyntaxKind.ExportAssignment))) {
      
      const jsxElements = returnStmt.getDescendantsOfKind(SyntaxKind.JsxElement);
      if (jsxElements.length > 0) {
        const rootElement = jsxElements[0]; // The first one is typically the root
        const openingElement = rootElement.getOpeningElement();
        
        if (openingElement.getTagNameNode().getText() === 'div') {
          // Check if it has space-y-
          const classNameAttr = openingElement.getAttribute('className');
          if (classNameAttr && classNameAttr.isKind(SyntaxKind.JsxAttribute)) {
            const initializer = classNameAttr.getInitializer();
            if (initializer && initializer.getText().includes('space-y-')) {
              openingElement.getTagNameNode().replaceWithText('PageContainer');
              rootElement.getClosingElement().getTagNameNode().replaceWithText('PageContainer');
              hasChanges = true;
            }
          }
        }

        // Now look for PageTitle
        const pageTitles = rootElement.getDescendantsOfKind(SyntaxKind.JsxOpeningElement).filter(e => e.getTagNameNode().getText() === 'PageTitle');
        if (pageTitles.length > 0) {
          const pageTitle = pageTitles[0];
          // Usually PageTitle is inside a div, along with PageSubtitle.
          // That div might be inside another flex div that holds actions.
          const pageTitleElement = pageTitle.getParentIfKindOrThrow(SyntaxKind.JsxElement);
          const parentDiv = pageTitleElement.getParentIfKind(SyntaxKind.JsxElement);
          
          if (parentDiv && parentDiv.getOpeningElement().getTagNameNode().getText() === 'div') {
            
            // Check if there is a subtitle
            let titleText = pageTitleElement.getJsxChildren()[0].getText();
            let subtitleText = '';
            
            const subtitleElements = parentDiv.getDescendantsOfKind(SyntaxKind.JsxOpeningElement).filter(e => e.getTagNameNode().getText() === 'PageSubtitle');
            if (subtitleElements.length > 0) {
               const subtitleEl = subtitleElements[0].getParentIfKindOrThrow(SyntaxKind.JsxElement);
               subtitleText = subtitleEl.getJsxChildren()[0].getText();
            }

            // Is the parent of this div a flex row with buttons?
            const grandParent = parentDiv.getParentIfKind(SyntaxKind.JsxElement);
            let headerElement = parentDiv;
            let actionsJsx = '';
            
            if (grandParent && grandParent.getOpeningElement().getTagNameNode().getText() === 'div') {
               const gpClass = grandParent.getOpeningElement().getAttribute('className')?.getInitializer()?.getText() || '';
               if (gpClass.includes('flex') && gpClass.includes('justify-between')) {
                 headerElement = grandParent; // This is the header container!
                 
                 // Actions would be the second child usually
                 const children = grandParent.getJsxChildren().filter(c => c.isKind(SyntaxKind.JsxElement));
                 if (children.length > 1) {
                   const actionsDiv = children[children.length - 1]; // last one is usually actions
                   actionsJsx = actionsDiv.getJsxChildren().map(c => c.getText()).join('\n');
                 }
               }
            }

            // Replace headerElement with PageHeader
            titleText = titleText.replace(/^{|}$|'|"/g, '').trim(); // rough unquote
            if (titleText.includes('trip.tripNumber')) titleText = '{trip.tripNumber}'; // special cases
            if (titleText.includes('vehicle.plateNumber')) titleText = '{vehicle.plateNumber}';
            if (titleText.includes('fullName')) titleText = '{fullName}';
            
            subtitleText = subtitleText.replace(/^{|}$|'|"/g, '').trim();

            let replacement = `<PageHeader \n        title=${titleText.startsWith('{') ? titleText : '"' + titleText + '"'}`;
            if (subtitleText) {
              replacement += `\n        subtitle="${subtitleText}"`;
            }
            if (actionsJsx) {
              replacement += `\n        actions={<>\n          ${actionsJsx}\n        </>}`;
            }
            replacement += `\n      />`;

            headerElement.replaceWithText(replacement);
            hasChanges = true;
          }
        }
      }
    }
  }

  if (hasChanges) {
    // Add imports
    const typographyImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === '@/components/ui/Typography');
    if (typographyImport) {
      typographyImport.remove();
    }
    
    // Add layout import if not exists
    const layoutImport = sourceFile.getImportDeclaration(decl => decl.getModuleSpecifierValue() === '@/components/layout');
    if (!layoutImport) {
      sourceFile.addImportDeclaration({
        namedImports: ['PageContainer', 'PageHeader'],
        moduleSpecifier: '@/components/layout'
      });
    }

    sourceFile.saveSync();
    console.log(`Updated ${sourceFile.getFilePath()}`);
  }
}
