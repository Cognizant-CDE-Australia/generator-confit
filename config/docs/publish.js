'use strict';

// START_CONFIT_GENERATED_CONTENT
const path = require('path');
const basePath = path.join(__dirname, '/../../');

// If the documentation.publish mechanism is GitHub, do this:
const ghpages = require('gh-pages');
const docOutputDir = path.join(basePath, 'webdocs/');

let callback = (err) => {
  if (!err) {
    console.info(`Published documentation from ${docOutputDir} to /gh-pages branch`);
  } else {
    console.error(err);
  }
}

let options = {
  logger: function(message) {
    console.log(message);
  }
};
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
ghpages.publish(docOutputDir, options, callback);


// END_CONFIT_GENERATED_CONTENT

