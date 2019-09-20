const commander = require('../');

// Not testing output, just testing whether an error is detected.

describe('.version', () => {
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

  test('when specify unknown program option then error', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .option('-p, --pepper', 'add pepper');

    expect(() => {
      program.parse(['node', 'test', '-m']);
    }).toThrow();
  });

  test('when specify unknown program option and allowUnknownOption then no error', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .allowUnknownOption()
      .option('-p, --pepper', 'add pepper');

    expect(() => {
      program.parse(['node', 'test', '-m']);
    }).not.toThrow();
  });

  test('when specify unknown command option then error', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .command('sub')
      .option('-p, --pepper', 'add pepper')
      .action(() => { });

    expect(() => {
      program.parse(['node', 'test', 'sub', '-m']);
    }).toThrow();
  });

  test('when specify unknown command option and allowUnknownOption then no error', () => {
    const program = new commander.Command();
    program
      ._exitOverride()
      .command('sub')
      .allowUnknownOption()
      .option('-p, --pepper', 'add pepper')
      .action(() => { });

    expect(() => {
      program.parse(['node', 'test', 'sub', '-m']);
    }).not.toThrow();
  });
});
