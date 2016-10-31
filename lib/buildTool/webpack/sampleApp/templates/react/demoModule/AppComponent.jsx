'use strict';

import React from 'react';
import {Router, Route, IndexRedirect, hashHistory} from 'react-router';
import DemoService from './DemoService';
import Page1 from './Page1Component';
import Page2 from './Page2Component';

const wrappedPage1 = function() {
  return Page1({demoAction: DemoService.demo});
};

const wrappedPage2 = function() {
  return Page2({demoAction: DemoService.demo});
};


export default function AppComponent() {
  return (
    <Router history={hashHistory}>
      <Route path="/">
        <IndexRedirect to="/page1"/>
        <Route path="/page1" component={wrappedPage1} />
        <Route path="/page2" component={wrappedPage2} />
      </Route>
    </Router>
  );
}
