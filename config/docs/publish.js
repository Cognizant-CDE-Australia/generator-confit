'use strict';

// START_CONFIT_GENERATED_CONTENT
const path = require('path');
const basePath = path.join(__dirname, '/../../');

// If the documentation.publish mechanism is GitHub, do this:

const ghpages = require('gh-pages');
const docOutputDir = path.join(basePath, 'website/');

let callback = (err) => {
  if (!err) {
    console.info(`Published documentation from ${docOutputDir} to /gh-pages branch`);
  } else {
    console.error(err);
  }
};

let options = {
  logger: function(message) {
    console.log(message);
  }
};

// If we are running inside Travis, send the token
if (process.env.GH_TOKEN) {
  options.repo = 'https://' + process.env.GH_TOKEN + '@github.com/odecee/generator-confit.git';

  // Add some user information for the gh-pages commit
  options.user = {
    email: 'gh-pages@github',
    name: 'GH Pages Committer'
  };
}
// END_CONFIT_GENERATED_CONTENT



// START_CONFIT_GENERATED_CONTENT
ghpages.publish(docOutputDir, options, callback);

// END_CONFIT_GENERATED_CONTENT

