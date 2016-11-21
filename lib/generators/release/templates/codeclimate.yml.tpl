<%
var jsExtensions = resources.buildJS.sourceFormat[buildJS.sourceFormat].ext;
jsExtensions.push('foo');
-%>engines:
  eslint:
    enabled: true
    channels: eslint-3
    config:
      config: <%- paths.config.configDir + resources.verify.configSubDir %>.eslintrc
      extensions:
      <% jsExtensions.forEach(function(ext) { -%>
  - .<%- ext %>
      <% }) %>
  duplication:
    enabled: true
    config:
      languages:
        - javascript
ratings:
  paths:
  <% jsExtensions.forEach(function(ext) { -%>
  - <%- paths.input.srcDir %>**/*.<%- ext %>
  <% }) %>
exclude_paths:
  - "**/<%- paths.input.unitTestDir %>**"
  <% if (paths.input.systemTestDir) { %>- "**/<%- paths.input.systemTestDir %>**"<% } %>
