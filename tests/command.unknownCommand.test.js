const commander = require('../');

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

  test('when unknown argument in simple program then no error', () => {
    const program = new commander.Command();
    program.exitOverride();
    expect(() => {
      program.parse('node test.js unknown'.split(' '));
    }).not.toThrow();
  });

  test('when unknown command but action handler then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub');
    program
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
});
