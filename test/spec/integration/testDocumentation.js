'use strict';

const assert = require('assert');
const childProc = require('child_process');

const DOCS_COMMAND = 'npm run docs:build';

function runCommand(ioMode) {
  return childProc.execSync(DOCS_COMMAND, {
    stdio: ioMode || 'inherit',
    cwd: process.env.TEST_DIR
  });
}


module.exports = function(confitConfig) {

  if (confitConfig.documentation.generateDocs && confitConfig.documentation.createSampleDocs) {
    describe(`${DOCS_COMMAND}`, () => {

      it('should generate documentation without any errors', () => {
        assert.doesNotThrow(() => runCommand());
      });
    });
  } else {
    describe('No documentation tests for this fixture.', () => {});
  }
};
