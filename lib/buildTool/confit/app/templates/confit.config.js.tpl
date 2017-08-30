const yaml = require('js-yaml');
const fs = require('fs');
const { root } = require('./helpers')

const config = yaml.safeLoad(fs.readFileSync(root('confit.yml')));

// This property is helpful only when a sampleApp module exists. It is used to link systemTest page objects to Codecept
// at the time of writing.
config['generator-confit'].sampleAppModuleDir = '<%= paths.input.srcDir + paths.input.modulesSubDir + resources.sampleApp.demoDirName %>';

module.exports = config['generator-confit'];
