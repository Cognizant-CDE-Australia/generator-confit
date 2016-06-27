# Common folders to ignore
node_modules/*
bower_components/*

# Config folder (optional - you might want to lint this...)
<%= paths.config.configDir %>*

<% if (sampleApp.createSampleApp) { %>
# Sample project
<%= paths.input.srcDir + demoDir %>*
<% } -%>
