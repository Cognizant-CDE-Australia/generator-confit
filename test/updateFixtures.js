'use strict';
const path = require('path');
const baseDir = path.join(__dirname, '/../');
const resources = require(baseDir + 'lib/core/resources.js');
const _ = require('lodash');
const checksum = require('checksum');
const async = require('async');
const fs = require('fs-extra');
const yaml = require('js-yaml');

const sortKeys = require('sort-keys');
const FIXTURE_DIR = path.join(baseDir, 'test/fixtures/');

main();


/**
 * Finds the generator versions and calls updateFixtures() after gathering the version numbers
 */
function main() {
  // Update the generators used by every project type
  let generatorFiles = _.uniq([':app'].concat(
      resources.readYaml(baseDir + 'lib/projectType/browser/browserResources.yml').app.subGenerators,
      resources.readYaml(baseDir + 'lib/projectType/node/nodeResources.yml').app.subGenerators
    ))
    .map(item => item.split(':')[1])
    .map(name => {
      return {name: name, file: path.resolve(baseDir + 'lib/generators/' + name + '/index.js')};
    });

  let generatorName = resources.readYaml(baseDir + 'lib/core/resources.yml').rootGeneratorName;

  // Calculate the checksum on each generator file, then once that's done, update the fixtures
  async.each(generatorFiles, (item, cb) => {
    checksum.file(item.file, function(err, checksum) {
      item.version = checksum;
      cb(err);
    });
  }, () => updateFixtures(FIXTURE_DIR, generatorName, generatorFiles));
}

/**
 * Updates a single integration test fixtures to have the latest Confit generator versions
 * for each sub-generator.
 *
 * @param {string} dir                  Directory name
 * @param {string} rootGeneratorName    Root generator name
 * @param {string} generatorVersionInfo generator version number
 */
function updateFixtures(dir, rootGeneratorName, generatorVersionInfo) {
  // Get the files
  let files = fs.readdirSync(dir)
    .filter(file => fs.statSync(path.join(dir, file)).isFile() && file.match(/^[^x]+\.yml$/) !== null);

  let filesChanged = 0;

  // Update each file
  files.forEach(file => {
    let data = yaml.load(fs.readFileSync(path.join(dir, file)));
    let confit = data[rootGeneratorName];
    let fileChanged = false;

    // Loop through the generator version information
    generatorVersionInfo.forEach(item => {
      // If this config does not use this generator, then ignore it
      if (!confit[item.name]) {
        return;
      }

      if (confit[item.name]._version && confit[item.name]._version !== item.version) {
        console.log('Updating ' + file + '[' + item.name + '] from ' + confit[item.name]._version + ' to ' + item.version);
        confit[item.name]._version = item.version;
        fileChanged = true;
      }

      let origConfig = JSON.stringify(confit[item.name]);

      confit[item.name] = sortKeys(confit[item.name], {deep: true});
      let sortedConfig = JSON.stringify(confit[item.name]);

      if (origConfig !== sortedConfig) {
        fileChanged = true;
      }
    });

    if (fileChanged) {
      fs.writeFileSync(path.join(dir, file), yaml.dump(data));
      console.log(file + ' updated');
      filesChanged++;
    }
  });

  if (!filesChanged) {
    console.log('All fixtures already up-to-date');
  }
}
