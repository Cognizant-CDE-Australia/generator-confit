import angular from 'angular';

export default (function() {

  function requireAll(requireContext) {
    return requireContext.keys().map(requireContext);
  }

  const modules = requireAll(require.context('../../content/angular-components/', true, /^\.\/.*\/index.js$/));

  const moduleNames = modules.map(function(module) {
    return module.default ? module.default : module;
  });

  angular.module('app', moduleNames);

  angular.element(document).ready(function() {
    angular.bootstrap(document, ['app']);
  });

})();
