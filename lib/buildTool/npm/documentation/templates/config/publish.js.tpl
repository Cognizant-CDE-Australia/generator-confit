'use strict';

// START_CONFIT_GENERATED_CONTENT<%
var configPath = paths.config.configDir + 'docs/';
var relativePath = configPath.replace(/([^/]+)/g, '..');
%>
const path = require('path');
const basePath = path.join(__dirname, '/<%= relativePath %>');

// If the documentation.publish mechanism is GitHub, do this:
<% if (documentation.publishMethod === 'GitHub') { -%>
const ghpages = require('gh-pages');
const docOutputDir = path.join(basePath, '<%- documentation.outputDir %>');

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

<% } else if (documentation.publishMethod === 'cloud') { -%>

<% } else { %>

<% }%>
// END_CONFIT_GENERATED_CONTENT

