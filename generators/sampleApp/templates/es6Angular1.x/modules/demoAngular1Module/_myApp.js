(function(angular) {
  'use strict';

  var appModule = angular.module('myApp', [
    'ng',
    'myApp.myComponent'
  ]);

  appModule.controller('AppController', [
    function() {
      var vm = this;
      vm.appName = 'Hello World';
    }
  ]);

})(window.angular);
