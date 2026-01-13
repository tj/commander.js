const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Command.error()', () => {
  test('when error called with message then message displayed on stderr', (t) => {
    t.mock.method(process, 'exit', () => {});
    const stderrSpy = t.mock.method(process.stderr, 'write', () => {});

    const program = new commander.Command();
    const message = 'Goodbye';
    program.error(message);

    const callArgs = stderrSpy.mock.calls[0].arguments;
    assert.equal(callArgs[0], `${message}\n`);
  });

  test('when error called with no exitCode then process.exit(1)', (t) => {
    const exitSpy = t.mock.method(process, 'exit', () => {});

    const program = new commander.Command();
    program.configureOutput({
      writeErr: () => {},
    });

    program.error('Goodbye');

    const callArgs = exitSpy.mock.calls[0].arguments;
    assert.equal(callArgs[0], 1);
  });

  test('when error called with exitCode 2 then process.exit(2)', (t) => {
    const exitSpy = t.mock.method(process, 'exit', () => {});

    const program = new commander.Command();
    program.configureOutput({
      writeErr: () => {},
    });
    program.error('Goodbye', { exitCode: 2 });

    const callArgs = exitSpy.mock.calls[0].arguments;
    assert.equal(callArgs[0], 2);
  });

  test('when error called with code and exitOverride then throws with code', () => {
    const program = new commander.Command();
    program.exitOverride().configureOutput({
      writeErr: () => {},
    });

    const code = 'commander.mytest';
    assert.throws(
      () => {
        program.error('Goodbye', { code });
      },
      { code },
    );
  });
});
