const commander = require('../');
const path = require('path');

// Test details of the exitOverride errors.
// The important checks are the exitCode and code which are intended to be stable for
// semver minor versions. For now, also testing the error.message and that output occurred
// to detect accidental changes in behaviour.

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectCommanderError"] }] */

function expectCommanderError(err, exitCode, code, message) {
  expect(err).toBeInstanceOf(commander.CommanderError);
  expect(err.exitCode).toBe(exitCode);
  expect(err.code).toBe(code);
  expect(err.message).toBe(message);
}

describe('.exitOverride and error details', () => {
  // Use internal knowledge to suppress output to keep test output clean.
  let stderrSpy;

  beforeAll(() => {
    stderrSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    stderrSpy.mockClear();
  });

  afterAll(() => {
    stderrSpy.mockRestore();
  });

  test('when specify unknown program option then throw CommanderError', () => {
    const program = new commander.Command();
    program.exitOverride();

    let caughtErr;
    try {
      program.parse(['node', 'test', '-m']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.unknownOption',
      "error: unknown option '-m'",
    );
  });

  test('when specify unknown command then throw CommanderError', () => {
    const program = new commander.Command();
    program.name('prog').exitOverride().command('sub');

    let caughtErr;
    try {
      program.parse(['node', 'test', 'oops']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.unknownCommand',
      "error: unknown command 'oops'",
    );
  });

  // Same error as above, but with custom handler.
  test('when supply custom handler then throw custom error', () => {
    const customError = new commander.CommanderError(
      123,
      'custom-code',
      'custom-message',
    );
    const program = new commander.Command();
    program.exitOverride((_err) => {
      throw customError;
    });

    let caughtErr;
    try {
      program.parse(['node', 'test', '-m']);
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      customError.exitCode,
      customError.code,
      customError.message,
    );
  });

  test('when specify option without required value then throw CommanderError', () => {
    const optionFlags = '-p, --pepper <type>';
    const program = new commander.Command();
    program.exitOverride().option(optionFlags, 'add pepper');

    let caughtErr;
    try {
      program.parse(['node', 'test', '--pepper']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.optionMissingArgument',
      `error: option '${optionFlags}' argument missing`,
    );
  });

  test('when specify command without required argument then throw CommanderError', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('compress <arg-name>')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'compress']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.missingArgument',
      "error: missing required argument 'arg-name'",
    );
  });

  test('when specify program without required argument and no action handler then throw CommanderError', () => {
    const program = new commander.Command();
    program.exitOverride().argument('<arg-name>');

    let caughtErr;
    try {
      program.parse(['node', 'test']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.missingArgument',
      "error: missing required argument 'arg-name'",
    );
  });

  test('when specify excess argument then throw CommanderError', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowExcessArguments(false)
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'excess']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.excessArguments',
      'error: too many arguments. Expected 0 arguments but got 1.',
    );
  });

  test('when specify command with excess argument then throw CommanderError', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('speak')
      .allowExcessArguments(false)
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'speak', 'excess']);
    } catch (err) {
      caughtErr = err;
    }

    expect(stderrSpy).toHaveBeenCalled();
    expectCommanderError(
      caughtErr,
      1,
      'commander.excessArguments',
      "error: too many arguments for 'speak'. Expected 0 arguments but got 1.",
    );
  });

  test('when specify --help then throw CommanderError', () => {
    const writeSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => {});
    const program = new commander.Command();
    program.exitOverride();

    let caughtErr;
    try {
      program.parse(['node', 'test', '--help']);
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      0,
      'commander.helpDisplayed',
      '(outputHelp)',
    );
    writeSpy.mockRestore();
  });

  test('when executable subcommand and no command specified then throw CommanderError', () => {
    const program = new commander.Command();
    program.exitOverride().command('compress', 'compress description');

    let caughtErr;
    try {
      program.parse(['node', 'test']);
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(caughtErr, 1, 'commander.help', '(outputHelp)');
  });

  test('when specify --version then throw CommanderError', () => {
    const stdoutSpy = jest
      .spyOn(process.stdout, 'write')
      .mockImplementation(() => {});
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program.exitOverride().version(myVersion);

    let caughtErr;
    try {
      program.parse(['node', 'test', '--version']);
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(caughtErr, 0, 'commander.version', myVersion);
    stdoutSpy.mockRestore();
  });

  test('when executableSubcommand succeeds then call exitOverride', async () => {
    expect.hasAssertions();
    const pm = path.join(__dirname, 'fixtures/pm');
    const program = new commander.Command();
    await new Promise((resolve) => {
      program
        .exitOverride((err) => {
          expectCommanderError(
            err,
            0,
            'commander.executeSubCommandAsync',
            '(close)',
          );
          resolve();
        })
        .command('silent', 'description');
      program.parse(['node', pm, 'silent']);
    });
  });

  test('when mandatory program option missing then throw CommanderError', () => {
    const optionFlags = '-p, --pepper <type>';
    const program = new commander.Command();
    program.exitOverride().requiredOption(optionFlags, 'add pepper');

    let caughtErr;
    try {
      program.parse(['node', 'test']);
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      1,
      'commander.missingMandatoryOptionValue',
      `error: required option '${optionFlags}' not specified`,
    );
  });

  test('when option argument not in choices then throw CommanderError', () => {
    const optionFlags = '--colour <shade>';
    const program = new commander.Command();
    program
      .exitOverride()
      .addOption(new commander.Option(optionFlags).choices(['red', 'blue']));

    let caughtErr;
    try {
      program.parse(['--colour', 'green'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      1,
      'commander.invalidArgument',
      "error: option '--colour <shade>' argument 'green' is invalid. Allowed choices are red, blue.",
    );
  });

  test('when command argument not in choices then throw CommanderError', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .addArgument(new commander.Argument('<shade>').choices(['red', 'blue']))
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['green'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      1,
      'commander.invalidArgument',
      "error: command-argument value 'green' is invalid for argument 'shade'. Allowed choices are red, blue.",
    );
  });

  test('when custom processing for option throws InvalidArgumentError then catch CommanderError', () => {
    function justSayNo(value) {
      throw new commander.InvalidArgumentError('NO');
    }
    const optionFlags = '--colour <shade>';
    const program = new commander.Command();
    program.exitOverride().option(optionFlags, 'specify shade', justSayNo);

    let caughtErr;
    try {
      program.parse(['--colour', 'green'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      1,
      'commander.invalidArgument',
      "error: option '--colour <shade>' argument 'green' is invalid. NO",
    );
  });

  test('when custom processing for argument throws InvalidArgumentError then catch CommanderError', () => {
    function justSayNo(value) {
      throw new commander.InvalidArgumentError('NO');
    }
    const program = new commander.Command();
    program
      .exitOverride()
      .argument('[n]', 'number', justSayNo)
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['green'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      1,
      'commander.invalidArgument',
      "error: command-argument value 'green' is invalid for argument 'n'. NO",
    );
  });

  test('when has conflicting option then throw CommanderError', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .addOption(new commander.Option('--silent'))
      .addOption(new commander.Option('--debug').conflicts(['silent']));

    let caughtErr;
    try {
      program.parse(['--debug', '--silent'], { from: 'user' });
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(
      caughtErr,
      1,
      'commander.conflictingOption',
      "error: option '--debug' cannot be used with option '--silent'",
    );
  });

  test('when call error() then throw CommanderError', () => {
    const program = new commander.Command();
    program.exitOverride();

    let caughtErr;
    try {
      program.error('message');
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(caughtErr, 1, 'commander.error', 'message');
  });
});

test('when no override and error then exit(1)', () => {
  const exitSpy = jest.spyOn(process, 'exit').mockImplementation(() => {});
  const program = new commander.Command();
  program.configureOutput({ outputError: () => {} });
  program.parse(['--unknownOption'], { from: 'user' });
  expect(exitSpy).toHaveBeenCalledWith(1);
  exitSpy.mockRestore();
});

test('when custom processing throws custom error then throw custom error', () => {
  function justSayNo(value) {
    throw new Error('custom');
  }
  const program = new commander.Command();
  program
    .exitOverride()
    .option('-s, --shade <value>', 'specify shade', justSayNo);

  expect(() => {
    program.parse(['--shade', 'green'], { from: 'user' });
  }).toThrow('custom');
});
