'use strict';

// START_CONFIT_GENERATED_CONTENT
// Update the swanky.config.yaml file's version number
const latestVersion = require('latest-version');
const fs = require('fs');
const pkgName = '<%- pkg.name %>';

latestVersion(pkgName).then(version => {
  console.log(`Latest version of ${pkgName}: ${version}`);
  // Read Swanky config YAML file, modify the version, then save it again
  let text = fs.readFileSync('<%= documentation.srcDir %>swanky.config.yaml', 'utf8');

  text = text.replace(/^version:.*$/m, `version: ${version}`);
  fs.writeFileSync('<%= documentation.srcDir %>swanky.config.yaml', text, 'utf8')
});
// END_CONFIT_GENERATED_CONTENT

