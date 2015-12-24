(function(angular) {
  'use strict';

  var mod = angular.module('myApp.myComponent', [
    'demoModule/template/myComponentTemplate.html'
  ]);

  mod.directive('myComponent', [
    function() {
      return {
        restrict: 'E',
        templateUrl: 'demoModule/template/myComponentTemplate.html'
      };
    }
  ]);

})(window.angular);
