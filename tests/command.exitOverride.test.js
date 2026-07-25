import * as commander from '../index.js';
import * as path from 'path';
import { createTestCommand } from './testHelpers.js'; // createTestCommand sets exitOverride()
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test details of the exitOverride errors.
// `exitCode` and `code` are intended to be stable for semver minor versions.
// Also testing `message` to detect accidental changes in behaviour.

describe('Command.exitOverride', () => {
  test('when specify unknown program option then throw CommanderError', () => {
    const program = createTestCommand();

    assert.throws(
      () => {
        program.parse(['node', 'test', '-m']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.unknownOption');
        assert.equal(err.message, "error: unknown option '-m'");
        return true;
      },
    );
  });

  test('when specify unknown command then throw CommanderError', () => {
    const program = createTestCommand();
    program.name('prog').command('sub');

    assert.throws(
      () => {
        program.parse(['node', 'test', 'oops']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.unknownCommand');
        assert.equal(err.message, "error: unknown command 'oops'");
        return true;
      },
    );
  });

  // Same error as above, but with custom handler.
  test('when supply custom handler then throw custom error', () => {
    const customError = new commander.CommanderError(
      123,
      'custom-code',
      'custom-message',
    );
    const program = createTestCommand();
    program.exitOverride((_err) => {
      throw customError;
    });

    assert.throws(
      () => {
        program.parse(['node', 'test', '-m']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, customError.exitCode);
        assert.equal(err.code, customError.code);
        assert.equal(err.message, customError.message);
        return true;
      },
    );
  });

  test('when specify option without required value then throw CommanderError', () => {
    const optionFlags = '-p, --pepper <type>';
    const program = createTestCommand();
    program.option(optionFlags, 'add pepper');

    assert.throws(
      () => {
        program.parse(['node', 'test', '--pepper']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.optionMissingArgument');
        assert.equal(
          err.message,
          `error: option '${optionFlags}' argument missing`,
        );
        return true;
      },
    );
  });

  test('when specify command without required argument then throw CommanderError', () => {
    const program = createTestCommand();
    program.command('compress <arg-name>').action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', 'compress']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.missingArgument');
        assert.equal(
          err.message,
          "error: missing required argument 'arg-name'",
        );
        return true;
      },
    );
  });

  test('when specify program without required argument and no action handler then throw CommanderError', () => {
    const program = createTestCommand();
    program.argument('<arg-name>');

    assert.throws(
      () => {
        program.parse(['node', 'test']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.missingArgument');
        assert.equal(
          err.message,
          "error: missing required argument 'arg-name'",
        );
        return true;
      },
    );
  });

  test('when specify excess argument then throw CommanderError', () => {
    const program = createTestCommand();
    program.action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', 'excess']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.excessArguments');
        assert.equal(
          err.message,
          'error: too many arguments. Expected 0 arguments but got 1: excess.',
        );
        return true;
      },
    );
  });

  test('when specify command with excess argument then throw CommanderError', () => {
    const program = createTestCommand();
    program.command('speak').action(() => {});

    assert.throws(
      () => {
        program.parse(['node', 'test', 'speak', 'excess']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.excessArguments');
        assert.equal(
          err.message,
          "error: too many arguments for 'speak'. Expected 0 arguments but got 1: excess.",
        );
        return true;
      },
    );
  });

  test('when specify --help then throw CommanderError', () => {
    const program = createTestCommand();

    assert.throws(
      () => {
        program.parse(['node', 'test', '--help']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 0);
        assert.equal(err.code, 'commander.helpDisplayed');
        assert.equal(err.message, '(outputHelp)');
        return true;
      },
    );
  });

  test('when executable subcommand and no command specified then throw CommanderError', () => {
    const program = createTestCommand();
    program.command('compress', 'compress description');

    assert.throws(
      () => {
        program.parse(['node', 'test']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.help');
        assert.equal(err.message, '(outputHelp)');
        return true;
      },
    );
  });

  test('when specify --version then throw CommanderError', () => {
    const myVersion = '1.2.3';
    const program = createTestCommand();
    program.version(myVersion);

    assert.throws(
      () => {
        program.parse(['node', 'test', '--version']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 0);
        assert.equal(err.code, 'commander.version');
        assert.equal(err.message, myVersion);
        return true;
      },
    );
  });

  test('when executableSubcommand succeeds then call exitOverride', async () => {
    const pm = path.join(import.meta.dirname, 'fixtures/pm');
    const program = createTestCommand();
    await new Promise((resolve) => {
      program
        .exitOverride((err) => {
          assert.ok(err instanceof commander.CommanderError);
          assert.equal(err.exitCode, 0);
          assert.equal(err.code, 'commander.executeSubCommandAsync');
          assert.equal(err.message, '(close)');
          resolve();
        })
        .command('silent', 'description');
      program.parse(['node', pm, 'silent']);
    });
  });

  test('when mandatory program option missing then throw CommanderError', () => {
    const optionFlags = '-p, --pepper <type>';
    const program = createTestCommand();
    program.requiredOption(optionFlags, 'add pepper');

    assert.throws(
      () => {
        program.parse(['node', 'test']);
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.missingMandatoryOptionValue');
        assert.equal(
          err.message,
          `error: required option '${optionFlags}' not specified`,
        );
        return true;
      },
    );
  });

  test('when option argument not in choices then throw CommanderError', () => {
    const optionFlags = '--colour <shade>';
    const program = createTestCommand();
    program.addOption(
      new commander.Option(optionFlags).choices(['red', 'blue']),
    );

    assert.throws(
      () => {
        program.parse(['--colour', 'green'], { from: 'user' });
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.invalidArgument');
        assert.equal(
          err.message,
          "error: option '--colour <shade>' argument 'green' is invalid. Allowed choices are red, blue.",
        );
        return true;
      },
    );
  });

  test('when command argument not in choices then throw CommanderError', () => {
    const program = createTestCommand();
    program
      .addArgument(new commander.Argument('<shade>').choices(['red', 'blue']))
      .action(() => {});

    assert.throws(
      () => {
        program.parse(['green'], { from: 'user' });
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.invalidArgument');
        assert.equal(
          err.message,
          "error: command-argument value 'green' is invalid for argument 'shade'. Allowed choices are red, blue.",
        );
        return true;
      },
    );
  });

  test('when custom processing for option throws InvalidArgumentError then catch CommanderError', () => {
    function justSayNo(value) {
      throw new commander.InvalidArgumentError('NO');
    }
    const optionFlags = '--colour <shade>';
    const program = createTestCommand();
    program.option(optionFlags, 'specify shade', justSayNo);

    assert.throws(
      () => {
        program.parse(['--colour', 'green'], { from: 'user' });
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.invalidArgument');
        assert.equal(
          err.message,
          "error: option '--colour <shade>' argument 'green' is invalid. NO",
        );
        return true;
      },
    );
  });

  test('when custom processing for argument throws InvalidArgumentError then catch CommanderError', () => {
    function justSayNo(value) {
      throw new commander.InvalidArgumentError('NO');
    }
    const program = createTestCommand();
    program.argument('[n]', 'number', justSayNo).action(() => {});

    assert.throws(
      () => {
        program.parse(['green'], { from: 'user' });
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.invalidArgument');
        assert.equal(
          err.message,
          "error: command-argument value 'green' is invalid for argument 'n'. NO",
        );
        return true;
      },
    );
  });

  test('when has conflicting option then throw CommanderError', () => {
    const program = createTestCommand();
    program
      .addOption(new commander.Option('--silent'))
      .addOption(new commander.Option('--debug').conflicts(['silent']));

    assert.throws(
      () => {
        program.parse(['--debug', '--silent'], { from: 'user' });
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.conflictingOption');
        assert.equal(
          err.message,
          "error: option '--debug' cannot be used with option '--silent'",
        );
        return true;
      },
    );
  });

  test('when call error() then throw CommanderError', () => {
    const program = createTestCommand();

    assert.throws(
      () => {
        program.error('message');
      },
      (err) => {
        assert.ok(err instanceof commander.CommanderError);
        assert.equal(err.exitCode, 1);
        assert.equal(err.code, 'commander.error');
        assert.equal(err.message, 'message');
        return true;
      },
    );
  });

  test('when no override and error then exit(1)', (t) => {
    const exitSpy = t.mock.method(process, 'exit', () => {});
    const program = new commander.Command();
    program.configureOutput({ outputError: () => {} });
    program.parse(['--unknownOption'], { from: 'user' });
    assert.ok(exitSpy.mock.callCount() >= 1);
    assert.deepEqual(exitSpy.mock.calls[0].arguments, [1]);
  });

  test('when custom processing throws custom error then throw custom error', () => {
    function justSayNo(value) {
      throw new Error('custom');
    }
    const program = createTestCommand();
    program.option('-s, --shade <value>', 'specify shade', justSayNo);

    assert.throws(
      () => {
        program.parse(['--shade', 'green'], { from: 'user' });
      },
      (err) => {
        assert.ok(err instanceof Error);
        assert.equal(err.message, 'custom');
        return true;
      },
    );
  });
});
