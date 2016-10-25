'use strict';

import React from 'react';
import {render} from 'react-dom';
import {Router, Route, IndexRedirect, browserHistory} from 'react-router';
import DemoService from './DemoService';
import Page1 from './Page1Component';
import Page2 from './Page2Component';

// Require the CSS file explicitly (or it could be defined as an entry-point too).
<%
var cssEntryPointFiles = resources.sampleApp.cssSourceFormat[buildCSS.sourceFormat].entryPointFileNames.map(function(file) {
  return paths.input.stylesDir + file;
});

cssEntryPointFiles.forEach(function(file) { -%>
require('./<%= file %>');
<% }); -%>


const wrappedPage1 = function() {
  return Page1({demoAction: DemoService.demo});
};

const wrappedPage2 = function() {
  return Page2({demoAction: DemoService.demo});
};


render(
  <Router history={browserHistory}>
    <Route path="/page1" component={wrappedPage1} />
    <Route path="/page2" component={wrappedPage2} />
  </Router>,
  document.getElementById('root')
);
