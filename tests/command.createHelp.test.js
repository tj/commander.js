const commander = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

test('when override createCommand then affects help', () => {
  class MyHelp extends commander.Help {
    formatHelp(cmd, helper) {
      return 'custom';
    }
  }

  class MyCommand extends commander.Command {
    createHelp() {
      return Object.assign(new MyHelp(), this.configureHelp());
    }
  }

  const program = new MyCommand();
  assert.equal(program.helpInformation(), 'custom');
});
