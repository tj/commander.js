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
    program.parse('node test.js unknown'.split(' '));
  });

  test('when unknown command but action handler then no error', () => {
    const program = new commander.Command();
    program.command('sub');
    program
      .action(() => { });
    program.parse('node test.js unknown'.split(' '));
  });

  test('when unknown command but listener then no error', () => {
    const program = new commander.Command();
    program.command('sub');
    program
      .on('command:*', () => { });
    program.parse('node test.js unknown'.split(' '));
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
