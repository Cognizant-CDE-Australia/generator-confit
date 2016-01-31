'use strict';

import ReactDOM from 'react-dom';
import demoModule from './demoModule.jsx';
import Page1 from './template/page1.jsx';
import Page2 from './template/page2.jsx';

const demoService = demoModule.init(
  {
    page1: Page1,
    page2: Page2
  },
  ReactDOM.render
);

// Require the CSS file explicitly (or it could be defined as an entry-point too.
require('./styles/app.styl');

// Go to the first page once the window has loaded (we use a custom event here so that we don't try to do this within a test window)
window.addEventListener('customBootEvent', function () {
  demoService.gotoPage('page1');
});
