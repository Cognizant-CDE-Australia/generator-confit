'use strict';

const assert = require('assert');
const childProc = require('child_process');

/**
 * Runs Protractor tests inside a browser
 */
function runSystemTest() {
  let proc = childProc.spawnSync('npm', ['run', 'test:system:dev'], {
    stdio: 'inherit',
    cwd: process.env.TEST_DIR,
  });

  if (proc.status !== 0) {
    throw new Error(String(proc.error));
  }
}


module.exports = function() {
  describe('npm run dev (testSystemTest)', () => {
    it('should start a webserver and build the sampleApp correctly', function() {
      assert.doesNotThrow(() => runSystemTest());
    });
  });
};
