const commander = require('../');

// Not testing output, just testing whether an error is detected.

describe('allowUnknownOption', () => {
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

  test('when specify excess program argument then no error by default', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .action(() => {});

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).not.toThrow();
  });

  test('when specify excess program argument and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowExcessArguments(false)
      .action(() => {});

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).toThrow();
  });

  test('when specify excess program argument and allowExcessArguments() then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowExcessArguments()
      .action(() => {});

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).not.toThrow();
  });

  test('when specify excess program argument and allowExcessArguments(true) then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .allowExcessArguments(true)
      .action(() => {});

    expect(() => {
      program.parse(['excess'], { from: 'user' });
    }).not.toThrow();
  });

  test('when specify excess command argument then no error (by default)', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub')
      .action(() => { });

    expect(() => {
      program.parse(['sub', 'excess'], { from: 'user' });
    }).not.toThrow();
  });

  test('when specify excess command argument and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub')
      .allowUnknownOption()
      .allowExcessArguments(false)
      .action(() => { });

    expect(() => {
      program.parse(['sub', 'excess'], { from: 'user' });
    }).toThrow();
  });

  test('when specify expected arg and allowExcessArguments(false) then no error', () => {
    const program = new commander.Command();
    program
      .arguments('<file>')
      .exitOverride()
      .allowExcessArguments(false)
      .action(() => {});

    expect(() => {
      program.parse(['file'], { from: 'user' });
    }).not.toThrow();
  });

  test('when specify excess after <arg> and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    program
      .arguments('<file>')
      .exitOverride()
      .allowExcessArguments(false)
      .action(() => {});

    expect(() => {
      program.parse(['file', 'excess'], { from: 'user' });
    }).toThrow();
  });

  test('when specify excess after [arg] and allowExcessArguments(false) then error', () => {
    const program = new commander.Command();
    program
      .arguments('[file]')
      .exitOverride()
      .allowExcessArguments(false)
      .action(() => {});

    expect(() => {
      program.parse(['file', 'excess'], { from: 'user' });
    }).toThrow();
  });

  test('when specify args for [args...] and allowExcessArguments(false) then no error', () => {
    const program = new commander.Command();
    program
      .arguments('[files...]')
      .exitOverride()
      .allowExcessArguments(false)
      .action(() => {});

    expect(() => {
      program.parse(['file1', 'file2', 'file3'], { from: 'user' });
    }).not.toThrow();
  });
});
