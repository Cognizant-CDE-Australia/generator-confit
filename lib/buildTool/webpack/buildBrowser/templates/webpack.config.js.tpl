'use strict';

// START_CONFIT_GENERATED_CONTENT
function mergeConfig(mergeOptions) {
<% include ../../buildBrowser/templates/webpack.build.config.js.tpl %>
<% include ../../entryPoint/templates/webpack.entryPoint.config.js.tpl %>
<% include ../../buildJS/templates/webpack.buildJS.config.js.tpl %>
<% include ../../testUnit/templates/webpack.testUnit.config.js.tpl %>
<% include ../../buildAssets/templates/webpack.buildAssets.config.js.tpl %>
<% include ../../buildCSS/templates/webpack.buildCSS.config.js.tpl %>
<% include ../../buildHTML/templates/webpack.buildHTML.config.js.tpl %>
<% include ../../serverDev/templates/webpack.serverDev.config.js.tpl %>
<% include ../../buildBrowser/templates/webpack.finalize.config.js.tpl %>

return config;
}

// To remove content hashes, call helpers.removeHash(config.prop.parent, propertyName, regExMatcher (optional));
// For example helpers.removeHash(config.output, 'fileName', /\[(contentHash|hash).*?\]/)
// END_CONFIT_GENERATED_CONTENT

module.exports.mergeConfig = mergeConfig;
