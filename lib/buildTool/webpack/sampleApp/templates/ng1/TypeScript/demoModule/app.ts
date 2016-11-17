'use strict';

import * as angular from 'angular';
import 'angular-route';
import demoModule from './demoModule';

// Require the CSS file explicitly (or it could be defined as an entry-point too).
<%
var cssEntryPointFiles = resources.sampleApp.cssSourceFormat[buildCSS.sourceFormat].entryPointFileNames.map(function(file) {
  return paths.input.stylesDir + file;
});

cssEntryPointFiles.forEach(function(file) { -%>
require('./<%= file %>');
<% }); -%>

let app = angular.module('myApp', ['ngRoute', demoModule]);

app.config(['$routeProvider',
  function ($routeProvider) {
    $routeProvider.when('/page1', {
      template: require('./template/page1.html')
    }).when('/page2', {
      template: require('./template/page2.html')
    }).otherwise({
      redirectTo: '/page1'
    });
  }]);


app.run(['$rootScope', 'demoService', function($rootScope, demoService) {
  $rootScope.$on('$routeChangeStart', function(event, next) {
    demoService.demo(next.originalPath);
  });
}]);
