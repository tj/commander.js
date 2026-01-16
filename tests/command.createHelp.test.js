import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.createHelp() override in subclass', () => {
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
});
