'use strict';
const path = require('path');
const baseDir = path.join(__dirname, '/../');
const resources = require(baseDir + 'lib/core/resources.js');
const _ = require('lodash');
const checksum = require('checksum');
const async = require('async');
const fs = require('fs-extra');

const sortKeys = require('sort-keys');
const FIXTURE_DIR = path.join(baseDir, 'test/fixtures/');

main();

function main() {
  // Update the generators used by every project type
  let generatorFiles = _.uniq([':app'].concat(
      resources.readYaml(baseDir + 'lib/projectType/browser/browserResources.yml').app.subGenerators,
      resources.readYaml(baseDir + 'lib/projectType/node/nodeResources.yml').app.subGenerators
    ))
    .map(item => item.split(':')[1])
    .map(name => { return {name: name, file: path.resolve(baseDir + 'lib/generators/' + name + '/index.js') }; });

  let generatorName = resources.readYaml(baseDir + 'lib/core/resources.yml').rootGeneratorName;

  // Calculate the checksum on each generator file, then once that's done, update the fixtures
  async.each(generatorFiles, (item, cb)  => {
    checksum.file(item.file, function(err, checksum) {
      item.version = checksum;
      cb(err);
    });
  }, () => updateFixtures(FIXTURE_DIR, generatorName, generatorFiles));
}


function updateFixtures(dir, rootGeneratorName, generatorVersionInfo) {
  // Get the files
  let files = fs.readdirSync(dir)
    .filter(function(file) {
      return fs.statSync(path.join(dir, file)).isFile() && (file.match(/^[^x]+\.json$/) !== null);
    });

  // Update each file
  files.forEach(file => {
    let json = fs.readJsonSync(path.join(dir, file));
    let confit = json[rootGeneratorName];
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
      fs.writeJsonSync(path.join(dir, file), json);
      console.log(file + ' updated');
    }
  });
}
