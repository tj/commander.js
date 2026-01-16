import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test some behaviours of .action not covered in more specific tests.

describe('Command.action()', () => {
  test('when .action called then command passed to action', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    const cmd = program.command('info').action(actionMock);
    program.parse(['node', 'test', 'info']);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], cmd.opts());
    assert.equal(callArgs[1], cmd);
  });

  test('when .action called then this is set to command', () => {
    const program = new commander.Command();
    let actionThis;
    const cmd = program.command('info').action(function () {
      actionThis = this;
    });
    program.parse(['node', 'test', 'info']);
    assert.equal(actionThis, cmd);
  });

  test('when .action called then program.args only contains args', () => {
    // At one time program.args was being modified to contain the same args as the call to .action
    // and so included the command as an extra and unexpected complex item in array.
    const program = new commander.Command();
    program.command('info <file>').action(() => {});
    program.parse(['node', 'test', 'info', 'my-file']);
    assert.deepEqual(program.args, ['info', 'my-file']);
  });

  describe('when .action on program with required argument and argument supplied then action called', () => {
    getTestCases('<file>').forEach(([methodName, program]) => {
      test(`via ${methodName}`, (t) => {
        const actionMock = t.mock.fn();
        program.action(actionMock);
        program.parse(['node', 'test', 'my-file']);
        const callArgs = actionMock.mock.calls[0].arguments;
        assert.equal(callArgs[0], 'my-file');
        assert.equal(callArgs[1], program.opts());
        assert.equal(callArgs[2], program);
      });
    });
  });

  describe('when .action on program with required argument and argument not supplied then action not called', () => {
    getTestCases('<file>').forEach(([methodName, program]) => {
      test(`via ${methodName}`, (t) => {
        const actionMock = t.mock.fn();
        program.action(actionMock);
        assert.throws(() => {
          program.parse(['node', 'test']);
        });
        assert.equal(actionMock.mock.callCount(), 0);
      });
    });
  });

  // Changes made in #729 to call program action handler
  test('when .action on program and no arguments then action called', (t) => {
    const actionMock = t.mock.fn();
    const program = new commander.Command();
    program.action(actionMock);
    program.parse(['node', 'test']);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.equal(callArgs[0], program.opts());
    assert.equal(callArgs[1], program);
  });

  describe('when .action on program with optional argument supplied then action called', () => {
    getTestCases('[file]').forEach(([methodName, program]) => {
      test(`via ${methodName}`, (t) => {
        const actionMock = t.mock.fn();
        program.action(actionMock);
        program.parse(['node', 'test', 'my-file']);
        const callArgs = actionMock.mock.calls[0].arguments;
        assert.equal(callArgs[0], 'my-file');
        assert.equal(callArgs[1], program.opts());
        assert.equal(callArgs[2], program);
      });
    });
  });

  describe('when .action on program without optional argument supplied then action called', () => {
    getTestCases('[file]').forEach(([methodName, program]) => {
      test(`via ${methodName}`, (t) => {
        const actionMock = t.mock.fn();
        program.action(actionMock);
        program.parse(['node', 'test']);
        const callArgs = actionMock.mock.calls[0].arguments;
        assert.equal(callArgs[0], undefined);
        assert.equal(callArgs[1], program.opts());
        assert.equal(callArgs[2], program);
      });
    });
  });

  describe('when .action on program with optional argument and subcommand and program argument then program action called', () => {
    getTestCases('[file]').forEach(([methodName, program]) => {
      test(`via ${methodName}`, (t) => {
        const actionMock = t.mock.fn();
        program.action(actionMock);
        program.command('subcommand');

        program.parse(['node', 'test', 'a']);

        const callArgs = actionMock.mock.calls[0].arguments;
        assert.equal(callArgs[0], 'a');
        assert.equal(callArgs[1], program.opts());
        assert.equal(callArgs[2], program);
      });
    });
  });

  // Changes made in #1062 to allow this case
  describe('when .action on program with optional argument and subcommand and no program argument then program action called', () => {
    getTestCases('[file]').forEach(([methodName, program]) => {
      test(`via ${methodName}`, (t) => {
        const actionMock = t.mock.fn();
        program.action(actionMock);
        program.command('subcommand');

        program.parse(['node', 'test']);

        const callArgs = actionMock.mock.calls[0].arguments;
        assert.equal(callArgs[0], undefined);
        assert.equal(callArgs[1], program.opts());
        assert.equal(callArgs[2], program);
      });
    });
  });

  test('when action is async then can await parseAsync', async () => {
    let asyncFinished = false;
    async function delay() {
      await new Promise((resolve) => setTimeout(resolve, 100));
      asyncFinished = true;
    }
    const program = new commander.Command();
    program.action(delay);

    const later = program.parseAsync(['node', 'test']);
    assert.equal(asyncFinished, false);
    await later;
    assert.equal(asyncFinished, true);
  });

  function getTestCases(arg) {
    const withArguments = createTestCommand().arguments(arg);
    const withArgument = createTestCommand().argument(arg);
    const withAddArgument = createTestCommand().addArgument(
      new commander.Argument(arg),
    );
    return [
      ['.arguments', withArguments],
      ['.argument', withArgument],
      ['.addArgument', withAddArgument],
    ];
  }
});
