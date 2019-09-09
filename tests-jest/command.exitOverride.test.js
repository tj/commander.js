const commander = require('../');
const path = require('path');

// Test details of the exitOverride errors.
// The important checks are the exitCode and code which are intended to be stable for
// semver minor versions. For now, also testing the error.message and that output occured
// to detect accidental changes in behaviour.

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
    expect(caughtErr.exitCode).toBe(1);
    expect(caughtErr.code).toBe('commander.unknownOption');
    expect(caughtErr.message).toBe("error: unknown option '-m'");
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

    expect(caughtErr.exitCode).toBe(customError.exitCode);
    expect(caughtErr.code).toBe(customError.code);
    expect(caughtErr.message).toBe(customError.message);
  });

  // Same error as above, but with custom handler.
  test('when supply custom handler which returns then call process.exit', () => {
    const exitError = new Error('oops-returned');
    const processExitSpy = jest.spyOn(process, 'exit').mockImplementation(() => { throw exitError; });
    const program = new commander.Command();
    program
      ._exitOverride((_err) => { }); // [sic]

    expect(() => {
      program.parse(['node', 'test', '-m']);
    }).toThrow(exitError);
    expect(processExitSpy).toHaveBeenCalled();
    processExitSpy.mockRestore();
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
    expect(caughtErr.exitCode).toBe(1);
    expect(caughtErr.code).toBe('commander.optionMissingArgument');
    expect(caughtErr.message).toBe(`error: option '${optionFlags}' argument missing`);
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
    expect(caughtErr.exitCode).toBe(1);
    expect(caughtErr.code).toBe('commander.missingArgument');
    expect(caughtErr.message).toBe(`error: missing required argument 'arg-name'`);
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
    expect(caughtErr.exitCode).toBe(0);
    expect(caughtErr.code).toBe('commander.helpDisplayed');
    expect(caughtErr.message).toBe('(outputHelp)');
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
    expect(caughtErr.exitCode).toBe(0);
    expect(caughtErr.code).toBe('commander.helpDisplayed');
    expect(caughtErr.message).toBe('(outputHelp)');
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
    expect(caughtErr.exitCode).toBe(0);
    expect(caughtErr.code).toBe('commander.version');
    expect(caughtErr.message).toBe(myVersion);
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
    expect(caughtErr.exitCode).toBe(1);
    expect(caughtErr.code).toBe('commander.variadicArgNotLast');
    expect(caughtErr.message).toBe("error: variadic arguments must be last 'myVariadicArg'");
  });

  // test('when executableSubcommand has error then throw CommanderError', () => {
  //   const program = new commander.Command();
  //   program
  //     ._exitOverride()
  //     .command('exec-does-not-exist', 'description');

  //   // Executable command passes back spawn error
  //   expect(() => {
  //     program.parse(['node', 'test', 'exec-does-not-exist']);
  //   }).toThrow();
  // });

  // test('when executableSubcommand fine then throw CommanderError', () => {
  //   const pmInstall = path.join(__dirname, '../test/fixtures/pm-install');
  //   const program = new commander.Command();
  //   program
  //     ._exitOverride()
  //     .command('install', 'description', { executableFile: 'pmInstall' });

  //   // Executable command passes back spawn error
  //   expect(() => {
  //     program.parse(['node', 'test', 'install']);
  //   }).toThrow();
  // });
});
