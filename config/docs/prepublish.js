'use strict';

// START_CONFIT_GENERATED_CONTENT
const path = require('path');
const basePath = path.join(__dirname, '/../../');
const latestVersion = require('latest-version');
const fs = require('fs');
const pkgName = 'generator-confit';
const pkgRepo = 'generator-confit';

const IS_DRYRUN = process.argv.indexOf('-d') > -1;    // Allow a dry-run to see what changes would be made

let FILES_TO_PROCESS = [
  // Update the swanky.config.yaml file's version number and server path
  {
    name: 'docs/swanky.config.yaml',
    searchRE: /^version:.*$/m,
    replacement: (version) => `version: ${version}`
  },
  {
    name: 'docs/swanky.config.yaml',
    searchRE: /^serverPath:.*$/m,
    replacement: () => `serverPath: ${pkgRepo}`
  }
];

// In the next section you can modify FILES_TO_PROCESS to meet your needs...
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
latestVersion(pkgName).then(version => {
  console.log(`Latest version of ${pkgName}: ${version}`);

  // Patch the files
  FILES_TO_PROCESS.forEach(file => {
    let fileName = path.join(basePath, file.name);
    let text = fs.readFileSync(fileName, 'utf8');

    text = text.replace(file.searchRE, file.replacement(version));

    if (IS_DRYRUN) {
      console.info(`Updated version in ${file.name}:`);
      console.info(text);
      console.info('---------------');
    } else {
      fs.writeFileSync(fileName, text, 'utf8');
      console.log(`Updated version in ${file.name}`);
    }
  });
});
// END_CONFIT_GENERATED_CONTENT

