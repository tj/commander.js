const commander = require('../');
const path = require('path');

// Test details of the exitOverride errors.
// The important checks are the exitCode and code which are intended to be stable for
// semver minor versions. For now, also testing the error.message and that output occured
// to detect accidental changes in behaviour.

function expectCommanderError(err, exitCode, code, message) {
  expect(err).toBeInstanceOf(commander.CommanderError);
  expect(err.exitCode).toBe(exitCode);
  expect(err.code).toBe(code);
  expect(err.message).toBe(message);
}

describe('.exitOverride and error details', () => {
  // Use internal knowledge to suppress output to keep test output clean.
  let consoleErrorSpy;
  let writeSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
    writeSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
    writeSpy.mockRestore();
  });

  test('when specify unknown program option then throw CommanderError', () => {
    const program = new commander.Command();
    program
      ._exitOverride();

    let caughtErr;
    try {
      program.parse(['node', 'test', '-m']);
    } catch (err) {
      caughtErr = err;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 1, 'commander.unknownOption', "error: unknown option '-m'");
  });

  // Same error as above, but with custom handler.
  test('when supply custom handler then throw custom error', () => {
    const customError = new commander.CommanderError(123, 'custom-code', 'custom-message');
    const program = new commander.Command();
    program
      ._exitOverride((_err) => {
        throw customError;
      });

    let caughtErr;
    try {
      program.parse(['node', 'test', '-m']);
    } catch (err) {
      caughtErr = err;
    }

    expectCommanderError(caughtErr, customError.exitCode, customError.code, customError.message);
  });

  test('when specify option without required value then throw CommanderError', () => {
    const optionFlags = '-p, --pepper <type>';
    const program = new commander.Command();
    program
      ._exitOverride()
      .option(optionFlags, 'add pepper');

    let caughtErr;
    try {
      program.parse(['node', 'test', '--pepper']);
    } catch (err) {
      caughtErr = err;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 1, 'commander.optionMissingArgument', `error: option '${optionFlags}' argument missing`);
  });

  test('when specify command without required argument then throw CommanderError', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .command('compress <arg-name>')
      .action(() => { });

    let caughtErr;
    try {
      program.parse(['node', 'test', 'compress']);
    } catch (err) {
      caughtErr = err;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 1, 'commander.missingArgument', `error: missing required argument 'arg-name'`);
  });

  test('when specify --help then throw CommanderError', () => {
    const program = new commander.Command();
    program
      ._exitOverride();

    let caughtErr;
    try {
      program.parse(['node', 'test', '--help']);
    } catch (err) {
      caughtErr = err;
    }

    expect(writeSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 0, 'commander.helpDisplayed', '(outputHelp)');
  });

  test('when executable subcommand and no command specified then throw CommanderError', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .command('compress', 'compress description');

    let caughtErr;
    try {
      program.parse(['node', 'test']);
    } catch (err) {
      caughtErr = err;
    }

    // This is effectively treated as a deliberate request for help, rather than an error.
    expect(writeSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 0, 'commander.helpDisplayed', '(outputHelp)');
  });

  test('when specify --version then throw CommanderError', () => {
    const myVersion = '1.2.3';
    const program = new commander.Command();
    program
      ._exitOverride()
      .version(myVersion);

    let caughtErr;
    try {
      program.parse(['node', 'test', '--version']);
    } catch (err) {
      caughtErr = err;
    }

    expect(writeSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 0, 'commander.version', myVersion);
  });

  test('when program variadic argument not last then throw CommanderError', () => {
    // Note: this error is notified during parse, although could have been detected at declaration.
    const program = new commander.Command();
    program
      ._exitOverride()
      .arguments('<myVariadicArg...> [optionalArg]')
      .action(jest.fn);

    let caughtErr;
    try {
      program.parse(['node', 'test', 'a']);
    } catch (err) {
      caughtErr = err;
    }

    expect(consoleErrorSpy).toHaveBeenCalled();
    expectCommanderError(caughtErr, 1, 'commander.variadicArgNotLast', "error: variadic arguments must be last 'myVariadicArg'");
  });

  test('when executableSubcommand succeeds then call exitOverride', (done) => {
    const pm = path.join(__dirname, 'fixtures/pm');
    const program = new commander.Command();
    program
      ._exitOverride((err) => {
        expectCommanderError(err, 0, 'commander.executeSubCommandAsync', '(close)');
        done();
      })
      .command('silent', 'description');

    program.parse(['node', pm, 'silent']);
  });

  test('when executableSubcommand fails then call exitOverride', (done) => {
    // Tricky for override, get called for `error` event then `exit` event.
    const exitCallback = jest.fn()
      .mockImplementationOnce((err) => {
        expectCommanderError(err, 1, 'commander.executeSubCommandAsync', '(error)');
        expect(err.nestedError.code).toBe('ENOENT');
      })
      .mockImplementation((err) => {
        expectCommanderError(err, 0, 'commander.executeSubCommandAsync', '(close)');
        done();
      });
    const pm = path.join(__dirname, 'fixtures/pm');
    const program = new commander.Command();
    program
      ._exitOverride(exitCallback)
      .command('does-not-exist', 'fail');

    program.parse(['node', pm, 'does-not-exist']);
  });
});
