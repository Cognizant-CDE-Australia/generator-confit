# START_CONFIT_GENERATED_CONTENT
# Common folders to ignore
node_modules/*
bower_components/*

# Config folder (optional - you might want to lint this...)
<%= paths.config.configDir %>*

<% if (app.projectType === 'node' && sampleApp.createSampleApp) { %>
# Sample project
<%= paths.input.srcDir + resources.sampleApp.demoDir %>*
<% } -%>
<% if (app.projectType === 'browser' && sampleApp.createSampleApp) { %>
# Sample project
<%= paths.input.modulesDir + resources.sampleApp.demoDirName %>*
<% } -%>
# END_CONFIT_GENERATED_CONTENT
