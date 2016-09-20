'use strict';

// START_CONFIT_GENERATED_CONTENT<%
var configPath = paths.config.configDir + resources.documentation.configSubDir;
var relativePath = configPath.replace(/([^/]+)/g, '..');
%>
const path = require('path');
const basePath = path.join(__dirname, '/<%= relativePath %>');

// If the documentation.publish mechanism is GitHub, do this:
<% if (documentation.publishMethod === resources.documentation.GITHUB_PUBLISH_METHOD) {
     var repoUrl = pkg.repository.url;
     var CIRepoUrl = 'https://\' + process.env.GH_TOKEN + \'@github.com/' + repoUrl.split('github.com/')[1];
%>
const ghpages = require('gh-pages');
const docOutputDir = path.join(basePath, '<%- documentation.outputDir %>');

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
  options.repo = '<%- CIRepoUrl %>';

  // Add some user information for the gh-pages commit
  options.user = {
    email: 'gh-pages@github',
    name: 'GH Pages Committer'
  };
}
// END_CONFIT_GENERATED_CONTENT


// START_CONFIT_GENERATED_CONTENT
ghpages.publish(docOutputDir, options, callback);

<% } else if (documentation.publishMethod === 'cloud') { -%>

<% } else { %>

<% }%>
// END_CONFIT_GENERATED_CONTENT

