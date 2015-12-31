'use strict'

import demoModule from './demoModule'


// Put this method onto the global object, so that the views can call on-click="gotoPage('pageName')"
window.myApp.gotoPage = demoModule.gotoPage;
