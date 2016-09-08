'use strict';

const ghpages = require('gh-pages');
const path = require('path');
const yaml = require('js-yaml');
const basePath = path.join(__dirname, '../../');
let confit = yaml.load(fs.readFileSync(path.join(basePath + 'confit.yml')))['generator-confit'];

ghpages.publish(path.join(basePath, confit.paths.docDir), (err) => {
  if (!err) {
    console.info('Published documentation to /gh-pages branch');
  } else {
    console.error(err);
  }
});
