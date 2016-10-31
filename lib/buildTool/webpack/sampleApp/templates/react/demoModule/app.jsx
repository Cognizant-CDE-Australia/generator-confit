'use strict';
// This must be the FIRST import in the FIRST entry point in order for hot module loading to work
import 'react-hot-loader/patch';

import React from 'react';
import {render} from 'react-dom';
import {AppContainer} from 'react-hot-loader';
import AppComponent from './AppComponent';

// Require the CSS file explicitly (or it could be defined as an entry-point too).
<%
var cssEntryPointFiles = resources.sampleApp.cssSourceFormat[buildCSS.sourceFormat].entryPointFileNames.map(function(file) {
  return paths.input.stylesDir + file;
});

cssEntryPointFiles.forEach(function(file) { -%>
require('./<%= file %>');
<% }); -%>


render(
  <AppContainer>
    <AppComponent/>
  </AppContainer>,
  document.getElementById('content')
);

// Hot Module Replacement API.
if (module.hot) {
  module.hot.accept('./AppComponent', render);
}
