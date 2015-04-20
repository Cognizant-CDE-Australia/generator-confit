'use strict';


module.exports = function(generator) {

  var gen = generator;

  function getTaskRunner(subGeneratorName) {
    var taskRunnerName = gen.config.get('taskRunner') || 'grunt';
    return require('../' + subGeneratorName + '/' + taskRunnerName + '/' + subGeneratorName + '.js')();
  }

  function hasExistingConfig(configKey) {
    return !!gen.config.get('configKey');
  }



  return {
    getTaskRunner: getTaskRunner,
    hasExistingConfig: hasExistingConfig
  };
};
