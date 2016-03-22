'use strict';

import 'angular';
import demoModule from './demoModule';
import ngRoute from 'angular-route';

// Require the CSS file explicitly (or it could be defined as an entry-point too).
<% $CSSEntryPoints.forEach(function (file) { -%>
require('./<%= file %>');
<% }); -%>


var app = angular.module('myApp', [ngRoute, demoModule]);

app.config(['$routeProvider',
  function($routeProvider) {
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

