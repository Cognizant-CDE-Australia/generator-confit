'use strict';

const assert = require('assert');
const childProc = require('child_process');

const DOCS_COMMAND = 'npm run docs:build';

/**
 * Runs a command with an options I/O mode
 * @param {string} ioMode   Can be 'pipe', or 'inherit' or any other
 * @return {Process}        Process instance
 */
function runCommand(ioMode) {
  return childProc.execSync(DOCS_COMMAND, {
    stdio: ioMode || 'inherit',
    cwd: process.env.TEST_DIR,
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
