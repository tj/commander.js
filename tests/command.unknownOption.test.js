const commander = require('../');

// Checking for detection of unknown options, including regression tests for some past issues.

describe('unknownOption', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let consoleErrorSpy;

  beforeAll(() => {
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
  });

  afterEach(() => {
    consoleErrorSpy.mockClear();
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  test('when specify unknown option with subcommand and action handler then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('info')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'info', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  test('when specify unknown option with subcommand argument and action handler then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('info <file>')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'info', 'a', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  test('when specify unknown option with program and action handler then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .arguments('[file]')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });

  test('when specify unknown option with program argument and action handler then error', () => {
    // Regression test from #965
    const program = new commander.Command();
    program
      .exitOverride()
      .arguments('[file]')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'info', 'a', '--NONSENSE']);
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownOption');
  });
});
