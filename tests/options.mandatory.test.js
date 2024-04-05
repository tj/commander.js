const commander = require('../');

// Assuming mandatory options behave as normal options apart from the mandatory aspect, not retesting all behaviour.
// Likewise, not redoing all tests on subcommand after testing on program.

describe('required program option with mandatory value specified', () => {
  test('when program has required value specified then value as specified', () => {
    const program = new commander.Command();
    program.exitOverride().requiredOption('--cheese <type>', 'cheese type');
    program.parse(['node', 'test', '--cheese', 'blue']);
    expect(program.opts().cheese).toBe('blue');
  });

  test('when program has option with name different than property then still recognised', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese-type <type>', 'cheese type');
    program.parse(['node', 'test', '--cheese-type', 'blue']);
    expect(program.opts().cheeseType).toBe('blue');
  });

  test('when program has required value default then default value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>', 'cheese type', 'default');
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBe('default');
  });

  test('when program has optional value flag specified then true', () => {
    const program = new commander.Command();
    program.exitOverride().requiredOption('--cheese [type]', 'cheese type');
    program.parse(['node', 'test', '--cheese']);
    expect(program.opts().cheese).toBe(true);
  });

  test('when program has optional value default then default value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese [type]', 'cheese type', 'default');
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBe('default');
  });

  test('when program has value/no flag specified with value then specified value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>', 'cheese type')
      .requiredOption('--no-cheese', 'no cheese thanks');
    program.parse(['node', 'test', '--cheese', 'blue']);
    expect(program.opts().cheese).toBe('blue');
  });

  test('when program has mandatory-yes/no flag specified with flag then true', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese', 'cheese type')
      .option('--no-cheese', 'no cheese thanks');
    program.parse(['node', 'test', '--cheese']);
    expect(program.opts().cheese).toBe(true);
  });

  test('when program has mandatory-yes/mandatory-no flag specified with flag then true', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese', 'cheese type')
      .requiredOption('--no-cheese', 'no cheese thanks');
    program.parse(['node', 'test', '--cheese']);
    expect(program.opts().cheese).toBe(true);
  });

  test('when program has yes/no flag specified negated then false', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>', 'cheese type')
      .option('--no-cheese', 'no cheese thanks');
    program.parse(['node', 'test', '--no-cheese']);
    expect(program.opts().cheese).toBe(false);
  });

  test('when program has required value specified and subcommand then specified value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>', 'cheese type')
      .command('sub')
      .action(() => {});
    program.parse(['node', 'test', '--cheese', 'blue', 'sub']);
    expect(program.opts().cheese).toBe('blue');
  });
});

describe('required program option with mandatory value not specified', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let writeErrorSpy;

  beforeAll(() => {
    writeErrorSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    writeErrorSpy.mockClear();
  });

  afterAll(() => {
    writeErrorSpy.mockRestore();
  });

  test('when program has required option not specified then error', () => {
    const program = new commander.Command();
    program.exitOverride().requiredOption('--cheese <type>', 'cheese type');

    expect(() => {
      program.parse(['node', 'test']);
    }).toThrow();
  });

  test('when program has optional option not specified then error', () => {
    const program = new commander.Command();
    program.exitOverride().requiredOption('--cheese [type]', 'cheese type');

    expect(() => {
      program.parse(['node', 'test']);
    }).toThrow();
  });

  test('when program has yes/no not specified then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese', 'cheese type')
      .option('--no-cheese', 'no cheese thanks');

    expect(() => {
      program.parse(['node', 'test']);
    }).toThrow();
  });

  test('when program has required value not specified and subcommand then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>', 'cheese type')
      .command('sub')
      .action(() => {});

    expect(() => {
      program.parse(['node', 'test', 'sub']);
    }).toThrow();
  });
});

describe('required command option with mandatory value specified', () => {
  test('when command has required value specified then no error and option has specified value', () => {
    const program = new commander.Command();
    let cmdOptions;
    program
      .exitOverride()
      .command('sub')
      .requiredOption('--subby <type>', 'description')
      .action((options) => {
        cmdOptions = options;
      });

    program.parse(['node', 'test', 'sub', '--subby', 'blue']);

    expect(cmdOptions.subby).toBe('blue');
  });

  test('when command has required value specified using env then no error and option has specified value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .addOption(
        new commander.Option('-p, --port <number>', 'port number')
          .makeOptionMandatory()
          .env('FOO'),
      );

    process.env.FOO = 'bar';
    program.parse([], { from: 'user' });
    delete process.env.FOO;

    expect(program.opts().port).toBe('bar');
  });
});

describe('required command option with mandatory value not specified', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let writeErrorSpy;

  beforeAll(() => {
    writeErrorSpy = jest
      .spyOn(process.stderr, 'write')
      .mockImplementation(() => {});
  });

  afterEach(() => {
    writeErrorSpy.mockClear();
  });

  afterAll(() => {
    writeErrorSpy.mockRestore();
  });

  test('when command has required value not specified then error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub')
      .requiredOption('--subby <type>', 'description')
      .action(() => {});

    expect(() => {
      program.parse(['node', 'test', 'sub']);
    }).toThrow();
  });

  test('when command has required value but not called then no error', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .command('sub')
      .requiredOption('--subby <type>', 'description')
      .action(() => {});
    program.command('sub2');

    expect(() => {
      program.parse(['node', 'test', 'sub2']);
    }).not.toThrow();
  });
});

describe('missing mandatory option but help requested', () => {
  // Optional. Use internal knowledge to suppress output to keep test output clean.
  let writeSpy;

  beforeAll(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => {});
  });

  afterEach(() => {
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
  });

  test('when program has required option not specified and --help then help', () => {
    const program = new commander.Command();
    program.exitOverride().requiredOption('--cheese <type>', 'cheese type');

    let caughtErr;
    try {
      program.parse(['node', 'test', '--help']);
    } catch (err) {
      caughtErr = err;
    }

    expect(caughtErr.code).toEqual('commander.helpDisplayed');
  });

  test('when program has required option not specified and subcommand --help then help', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>', 'cheese type')
      .command('sub')
      .action(() => {});

    let caughtErr;
    try {
      program.parse(['node', 'test', 'sub', '--help']);
    } catch (err) {
      caughtErr = err;
    }

    expect(caughtErr.code).toEqual('commander.helpDisplayed');
  });
});
