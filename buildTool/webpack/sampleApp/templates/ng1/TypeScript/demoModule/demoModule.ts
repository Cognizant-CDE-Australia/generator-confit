'use strict';

var angular = window.angular;
var mod = angular.module('demoModule', []);

mod.factory('demoService', function () {
  return {
    demo: function (param) {
      window.console.log('Message from demoService.demo():' + param);
    }
  };
});

export default mod.name;



