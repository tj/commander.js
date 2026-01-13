const path = require('path');
const commander = require('../');
const { createTestCommand } = require('./testHelpers');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

describe('Option.conflicts()', () => {
  function makeProgram(t) {
    const actionMock = t.mock.fn();
    const program = createTestCommand();
    program
      .command('foo')
      .addOption(
        new commander.Option('-s, --silent', "Don't print anything").env(
          'SILENT',
        ),
      )
      .addOption(
        new commander.Option('-j, --json', 'Format output as json')
          .env('JSON')
          .conflicts(['silent']),
      )
      .action(actionMock);

    return { program, actionMock };
  }

  test.beforeEach(() => {
    delete process.env.SILENT;
    delete process.env.JSON;
    delete process.env.DUAL;
    delete process.env.NO_DUAL;
  });

  test('should call action if there are no explicit conflicting options set', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js foo --json'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], { json: true });
  });

  test('should call action when there are no implicit conflicting options set', (t) => {
    const { program, actionMock } = makeProgram(t);
    program.parse('node test.js foo --silent'.split(' '));
    assert.equal(actionMock.mock.callCount(), 1);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], { silent: true });
  });

  test('should exit with error if conflicting options were set', (t) => {
    const { program } = makeProgram(t);

    assert.throws(
      () => {
        program.parse('node test.js foo --silent --json'.split(' '));
      },
      {
        message:
          "error: option '-j, --json' cannot be used with option '-s, --silent'",
      },
    );
  });

  test('should report the env variable as the conflicting option source, when conflicting option is set', (t) => {
    const { program } = makeProgram(t);

    process.env.SILENT = true;

    assert.throws(
      () => {
        program.parse('node test.js foo --json'.split(' '));
      },
      {
        message:
          "error: option '-j, --json' cannot be used with environment variable 'SILENT'",
      },
    );
  });

  test('should report the env variable as the configured option source, when configured option is set', (t) => {
    const { program } = makeProgram(t);

    process.env.JSON = true;

    assert.throws(
      () => {
        program.parse('node test.js foo --silent'.split(' '));
      },
      {
        message:
          "error: environment variable 'JSON' cannot be used with option '-s, --silent'",
      },
    );
  });

  test('should report both env variables as sources, when configured option and conflicting option are set', (t) => {
    const { program } = makeProgram(t);

    process.env.SILENT = true;
    process.env.JSON = true;

    assert.throws(
      () => {
        program.parse('node test.js foo'.split(' '));
      },
      {
        message:
          "error: environment variable 'JSON' cannot be used with environment variable 'SILENT'",
      },
    );
  });

  test('should allow default value with a conflicting option', (t) => {
    const { program, actionMock } = makeProgram(t);

    program.commands[0].addOption(
      new commander.Option('-d, --debug', 'print debug logs')
        .default(true)
        .conflicts(['silent']),
    );

    program.parse('node test.js foo --silent'.split(' '));

    assert.equal(actionMock.mock.callCount(), 1);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], { debug: true, silent: true });
  });

  test('should report conflict on negated option flag', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red').conflicts(['color']))
      .addOption(new commander.Option('--color'))
      .addOption(new commander.Option('-N, --no-color'));

    assert.throws(
      () => {
        program.parse('node test.js bar --red -N'.split(' '));
      },
      {
        message:
          "error: option '--red' cannot be used with option '-N, --no-color'",
      },
    );
  });

  test('should report conflict on negated option env variable', (t) => {
    const { program } = makeProgram(t);

    process.env.NO_COLOR = true;

    program
      .command('bar')
      .addOption(new commander.Option('--red').conflicts(['color']))
      .addOption(new commander.Option('--color'))
      .addOption(new commander.Option('-N, --no-color').env('NO_COLOR'));

    assert.throws(
      () => {
        program.parse('node test.js bar --red'.split(' '));
      },
      {
        message:
          "error: option '--red' cannot be used with environment variable 'NO_COLOR'",
      },
    );
  });

  test('should report correct error for shorthand negated option', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('-N, --no-color').conflicts(['red']));

    assert.throws(
      () => {
        program.parse('node test.js bar --red -N'.split(' '));
      },
      {
        message:
          "error: option '-N, --no-color' cannot be used with option '--red'",
      },
    );
  });

  test('should report correct error for positive option when negated is configured', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    assert.throws(
      () => {
        program.parse('node test.js bar --red --dual'.split(' '));
      },
      { message: "error: option '--dual' cannot be used with option '--red'" },
    );
  });

  test('should report correct error for negated option when positive is configured', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    assert.throws(
      () => {
        program.parse('node test.js bar --red --no-dual'.split(' '));
      },
      {
        message: "error: option '--no-dual' cannot be used with option '--red'",
      },
    );
  });

  test('should report correct error for positive env variable when negated is configured', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    process.env.DUAL = 'true';
    assert.throws(
      () => {
        program.parse('node test.js bar --red'.split(' '));
      },
      {
        message:
          "error: environment variable 'DUAL' cannot be used with option '--red'",
      },
    );
  });

  test('should report correct error for negated env variable when positive is configured', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    process.env.NO_DUAL = 'true';
    assert.throws(
      () => {
        program.parse('node test.js bar --red'.split(' '));
      },
      {
        message:
          "error: environment variable 'NO_DUAL' cannot be used with option '--red'",
      },
    );
  });

  test('should report correct error for positive option with string value when negated is configured', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual2 <str>').conflicts(['red']))
      .addOption(new commander.Option('--no-dual2').preset('BAD'));

    assert.throws(
      () => {
        program.parse('node test.js bar --red --dual2 foo'.split(' '));
      },
      {
        message:
          "error: option '--dual2 <str>' cannot be used with option '--red'",
      },
    );
  });

  test('should report correct error for negated option with preset when negated is configured', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual2 <str>').conflicts(['red']))
      .addOption(new commander.Option('--no-dual2').preset('BAD'));

    assert.throws(
      () => {
        program.parse('node test.js bar --red --no-dual2'.split(' '));
      },
      {
        message:
          "error: option '--no-dual2' cannot be used with option '--red'",
      },
    );
  });

  test('should not throw error when conflicts is invoked with a single string that includes another option', (t) => {
    const { program } = makeProgram(t);

    const actionMock = t.mock.fn();

    program
      .command('bar')
      .addOption(new commander.Option('--a'))
      .addOption(new commander.Option('--b').conflicts('aa'))
      .action(actionMock);

    program.parse('node test.js bar --a --b'.split(' '));

    assert.equal(actionMock.mock.callCount(), 1);
    const callArgs = actionMock.mock.calls[0].arguments;
    assert.deepEqual(callArgs[0], { a: true, b: true });
  });

  test('should throw error when conflicts is invoked with a single string that equals another option', (t) => {
    const { program } = makeProgram(t);

    program
      .command('bar')
      .addOption(new commander.Option('--a'))
      .addOption(new commander.Option('--b').conflicts('a'));

    assert.throws(
      () => {
        program.parse('node test.js bar --a --b'.split(' '));
      },
      { message: "error: option '--b' cannot be used with option '--a'" },
    );
  });

  test('when conflict on program calling action subcommand then throw conflict', (t) => {
    const { program } = makeProgram(t);
    let exception;

    program
      .addOption(new commander.Option('--black'))
      .addOption(new commander.Option('--white').conflicts('black'));

    try {
      program.parse('--white --black foo'.split(' '), { from: 'user' });
    } catch (err) {
      exception = err;
    }
    assert.notEqual(exception, undefined);
    assert.equal(exception.code, 'commander.conflictingOption');
  });

  test('when conflict on program calling action subcommand with help then show help', (t) => {
    const { program } = makeProgram(t);
    let exception;

    program
      .addOption(new commander.Option('--black'))
      .addOption(new commander.Option('--white').conflicts('black'));

    try {
      program.parse('--white --black foo --help'.split(' '), { from: 'user' });
    } catch (err) {
      exception = err;
    }
    assert.notEqual(exception, undefined);
    assert.equal(exception.code, 'commander.helpDisplayed');
  });

  test('when conflict on program calling external subcommand then throw conflict', (t) => {
    const { program } = makeProgram(t);
    let exception;

    program
      .addOption(new commander.Option('--black'))
      .addOption(new commander.Option('--white').conflicts('black'));
    const pm = path.join(__dirname, './fixtures/pm');
    program.command('ext', 'external command', { executableFile: pm });

    try {
      program.parse('--white --black ext'.split(' '), { from: 'user' });
    } catch (err) {
      exception = err;
    }
    assert.notEqual(exception, undefined);
    assert.equal(exception.code, 'commander.conflictingOption');
  });
});
