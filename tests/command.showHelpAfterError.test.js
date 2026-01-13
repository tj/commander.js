const commander = require('../');
const { test, describe, mock } = require('node:test');
const assert = require('node:assert/strict');

describe('Command.showHelpAfterError(message)', () => {
  const customHelpMessage = 'See --help';

  function makeProgram(t) {
    const writeMock = t.mock.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .showHelpAfterError(customHelpMessage)
      .configureOutput({ writeErr: writeMock });

    return { program, writeMock };
  }

  test('when missing command-argument then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    program.argument('<file>');
    assert.throws(
      () => {
        program.parse([], { from: 'user' });
      },
      {
        code: 'commander.missingArgument',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });

  test('when missing option-argument then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    program.option('--output <file>');
    assert.throws(
      () => {
        program.parse(['--output'], { from: 'user' });
      },
      {
        code: 'commander.optionMissingArgument',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });

  test('when missing mandatory option then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    program.requiredOption('--password <cipher>');
    assert.throws(
      () => {
        program.parse([], { from: 'user' });
      },
      {
        code: 'commander.missingMandatoryOptionValue',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });

  test('when unknown option then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    assert.throws(
      () => {
        program.parse(['--unknown-option'], { from: 'user' });
      },
      {
        code: 'commander.unknownOption',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });

  test('when too many command-arguments then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    program.allowExcessArguments(false);
    assert.throws(
      () => {
        program.parse(['surprise'], { from: 'user' });
      },
      {
        code: 'commander.excessArguments',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });

  test('when unknown command then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    program.command('sub1');
    assert.throws(
      () => {
        program.parse(['sub2'], { from: 'user' });
      },
      {
        code: 'commander.unknownCommand',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });

  test('when invalid option choice then shows help', (t) => {
    const { program, writeMock } = makeProgram(t);
    program.addOption(new commander.Option('--color').choices(['red', 'blue']));
    assert.throws(
      () => {
        program.parse(['--color', 'pink'], { from: 'user' });
      },
      {
        code: 'commander.invalidArgument',
      },
    );
    const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
    assert.equal(lastCall.arguments[0], `${customHelpMessage}\n`);
  });
});

test('when Command.showHelpAfterError() and error and then shows full help', () => {
  const writeMock = mock.fn();
  const program = new commander.Command();
  program
    .exitOverride()
    .showHelpAfterError()
    .configureOutput({ writeErr: writeMock });

  try {
    program.parse(['--unknown-option'], { from: 'user' });
  } catch (err) {
    /* empty */
  }
  const lastCall = writeMock.mock.calls[writeMock.mock.calls.length - 1];
  assert.equal(lastCall.arguments[0], program.helpInformation());
});
