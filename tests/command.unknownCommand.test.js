const commander = require('../');

describe('unknownCommand', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let writeErrorSpy;

  beforeAll(() => {
    writeErrorSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeErrorSpy.mockClear();
  });

  afterAll(() => {
    writeErrorSpy.mockRestore();
  });

  test('when unknown argument in simple program then no error', () => {
    const program = new commander.Command();
    program.exitOverride();
    expect(() => {
      program.parse('node test.js unknown'.split(' '));
    }).not.toThrow();
  });

  test('when unknown command but action handler taking arg then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub');
    program
      .argument('[args...]')
      .action(() => { });
    expect(() => {
      program.parse('node test.js unknown'.split(' '));
    }).not.toThrow();
  });

  test('when unknown command but listener then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub');
    program
      .on('command:*', () => { });
    expect(() => {
      program.parse('node test.js unknown'.split(' '));
    }).not.toThrow();
  });

  test('when unknown command then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub');
    let caughtErr;
    try {
      program.parse('node test.js unknown'.split(' '));
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownCommand');
  });

  test('when unknown command and unknown option then error is for unknown command', () => {
    //  The unknown command is more useful since the option is for an unknown command (and might be
    // ok if the command had been correctly spelled, say).
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub');
    let caughtErr;
    try {
      program.parse('node test.js sbu --silly'.split(' '));
    } catch (err) {
      caughtErr = err;
    }
    expect(caughtErr.code).toBe('commander.unknownCommand');
  });
});
