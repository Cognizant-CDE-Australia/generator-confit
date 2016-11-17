import * as angular from 'angular';

let mod = angular.module('demoModule', []);

mod.factory('demoService', function () {
  return {
    demo: function (param) {
      window.console.log('Message from demoService.demo():' + param);
    }
  };
});

export default mod.name;



