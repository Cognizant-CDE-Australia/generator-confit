'use strict';
const path = require('path');
const baseDir = path.join(__dirname, '/../../');
const packageYaml = path.join(baseDir, 'lib/core/packages.yml');
const fs = require('fs-extra');
const yaml = require('js-yaml');
const ncu = require('npm-check-updates');

main();


/**
 * Finds the generator versions and calls updateFixtures() after gathering the version numbers
 */
function main() {
  // Read Yaml file
  let packageFile = yaml.load(fs.readFileSync(packageYaml));
  let packageData = {};

  // Get list of packages
  packageFile.$packages.forEach(pkg => packageData[pkg.name] = pkg.version);
  // Pass list to ncu & display results
  checkForUpdates(packageData);//{'swanky': '1.0.0', 'webpack': '1.0.0'});
}


function checkForUpdates(packageObj) {

  ncu.run({
    // Always specify the path to the package file
    packageData: JSON.stringify({dependencies: packageObj}),
    // Any command-line option can be specified here.
    // These are set by default:
    logLevel: 'error',
    greatest: true,
    silent: true,
    jsonUpgraded: true
  }).then((upgraded) => {
    console.log('\nTo upgrade:');
    //, upgraded);
    let keys = Object.keys(upgraded);
    keys.forEach(key => console.log(`${key}  ${packageObj[key]} → ${upgraded[key]}`));
  });
}
