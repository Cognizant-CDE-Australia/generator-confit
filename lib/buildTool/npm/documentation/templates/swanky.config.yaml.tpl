<%
var selectedFramework = (config.buildJS.framework) ? config.buildJS.framework[0] : '' || '';
var isNG1 = selectedFramework === 'AngularJS 1.x';

// Need to trim the '/' character off the path for Swanky, as at September 7 2016
function dropTrailingSlash(path) {
  return path.substr(path.length - 1) === '/' ? path.substr(0, path.length - 1) : path;
}
-%>
title: <%- pkg.name %>
repo: <%- pkg.repository.url %>
version: <%- pkg.version %>
src: <%- dropTrailingSlash(documentation.srcDir) %>
theme: <%- documentation.srcDir %>themes/test-theme
output: <%- dropTrailingSlash(documentation.outputDir) %>
# serverPath will only be set when publishing the documentation
serverPath:

sections:
  - title: Foundation
    content:
      - src: <%- documentation.srcDir %>content/foundation/01-overview.md
      - title: 01 Colour Palette
        src: <%- documentation.srcDir %>content/foundation/02-colour-palette.md
      - title: 02 Typography
        src: <%- documentation.srcDir %>content/foundation/03-typography.md
      - title: 03 Grid
        src: <%- documentation.srcDir %>content/foundation/04-grid.md
      - title: 04 Units
        src: <%- documentation.srcDir %>content/foundation/05-units.md

  - title: Components
    content: <%- documentation.srcDir %>content/components/overview.md
    subSections:
      - title: Cards
        <% if (isNG1) { %>
        bootstrap:
          - src: <%- documentation.srcDir %>config/bootstrap/angular.bootstrap.js
        <% } %>
        content:
          - src: <%- documentation.srcDir %>content/components/card/card-overview.md
          <% if (isNG1) { %>- title: <strong>1.1</strong> Card Component
            src: <%- documentation.srcDir %>content/angular-components/card/card.js
            preprocessor:
              swanky-processor-ngdocs: {}
          <% } %><% if (isNG1) { %>- title: <strong>1.2</strong> Card Header
            src: <%- documentation.srcDir %>content/angular-components/card/card-header.js
            preprocessor:
              swanky-processor-ngdocs: {}
          <% } %>- title: 1.3 Card Accessibility
            src: <%- documentation.srcDir %>content/components/card/card-accessibility.md
