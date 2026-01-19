import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.createCommand()', () => {
  test('when createCommand then unattached', () => {
    const program = new commander.Command();
    const cmd = program.createCommand();
    assert.equal(program.commands.length, 0);
    assert.equal(cmd.parent, null);
  });

  test('when subclass overrides createCommand then subcommand is subclass', () => {
    class MyClass extends commander.Command {
      constructor(name) {
        super();
        this.myProperty = 'myClass';
      }

      createCommand(name) {
        return new MyClass(name);
      }
    }
    const program = new MyClass();
    const sub = program.command('sub');
    assert.equal(sub.myProperty, 'myClass');
  });

  test('when override createCommand then subcommand is custom', () => {
    function createCustom(name) {
      const cmd = new commander.Command();
      cmd.myProperty = 'custom';
      return cmd;
    }
    const program = createCustom();
    program.createCommand = createCustom;
    const sub = program.command('sub');
    assert.equal(sub.myProperty, 'custom');
  });
});
