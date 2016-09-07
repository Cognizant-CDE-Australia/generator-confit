'use strict';

// START_CONFIT_GENERATED_CONTENT
// Update the swanky.config.yaml file's serverPath back to blank
const fs = require('fs');
const pkgName = 'generator-confit';
// END_CONFIT_GENERATED_CONTENT

// START_CONFIT_GENERATED_CONTENT
console.log(`Resetting Swanky serverPath to blank...`);
// Read Swanky config YAML file, modify the version, then save it again
let text = fs.readFileSync('docs/swanky.config.yaml', 'utf8');

text = text.replace(/^serverPath:.*$/m, `serverPath:`);
fs.writeFileSync('docs/swanky.config.yaml', text, 'utf8');
console.log(`done`);
// END_CONFIT_GENERATED_CONTENT

