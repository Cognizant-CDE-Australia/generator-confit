'use strict';

import demoModule from './demoModule';

// Require the CSS file explicitly (or it could be defined as an entry-point too.
require('./<%= $CSSFilePath %>');

// Put this method onto the global object, so that the views can call on-click="gotoPage('pageName')"
(<any>window).gotoPage = demoModule.gotoPage;

// Require the HTML files explicitly so that they are in the Webpack dependency tree
(<any>window).page1 = require('./template/page1.html');
(<any>window).page2 = require('./template/page2.html');

// Go to the first page once the window has loaded (we use a custom event here so that we don't try to do this within a test window)
window.addEventListener('customBootEvent', function () {
  demoModule.gotoPage('page1');
});

export default 'app'; // Dummy export, needed to satisfy unit tests
