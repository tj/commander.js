const path = require('path');
const commander = require('../');

describe('command with conflicting options', () => {
  function makeProgram() {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .configureOutput({
        writeErr: () => {},
        writeOut: () => {},
      })
      .command('foo')
      .addOption(
        new commander.Option('-s, --silent', "Don't print anything").env(
          'SILENT',
        ),
      )
      .addOption(
        new commander.Option('-j, --json', 'Format output as json')
          .env('JSON')
          .conflicts(['silent']),
      )
      .action(actionMock);

    return { program, actionMock };
  }

  beforeEach(() => {
    delete process.env.SILENT;
    delete process.env.JSON;
    delete process.env.DUAL;
    delete process.env.NO_DUAL;
  });

  test('should call action if there are no explicit conflicting options set', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js foo --json'.split(' '));
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith({ json: true }, expect.any(Object));
  });

  test('should call action when there are no implicit conflicting options set', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js foo --silent'.split(' '));
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith(
      { silent: true },
      expect.any(Object),
    );
  });

  test('should exit with error if conflicting options were set', () => {
    const { program } = makeProgram();

    expect(() => {
      program.parse('node test.js foo --silent --json'.split(' '));
    }).toThrow(
      "error: option '-j, --json' cannot be used with option '-s, --silent'",
    );
  });

  test('should report the env variable as the conflicting option source, when conflicting option is set', () => {
    const { program } = makeProgram();

    process.env.SILENT = true;

    expect(() => {
      program.parse('node test.js foo --json'.split(' '));
    }).toThrow(
      "error: option '-j, --json' cannot be used with environment variable 'SILENT'",
    );
  });

  test('should report the env variable as the configured option source, when configured option is set', () => {
    const { program } = makeProgram();

    process.env.JSON = true;

    expect(() => {
      program.parse('node test.js foo --silent'.split(' '));
    }).toThrow(
      "error: environment variable 'JSON' cannot be used with option '-s, --silent'",
    );
  });

  test('should report both env variables as sources, when configured option and conflicting option are set', () => {
    const { program } = makeProgram();

    process.env.SILENT = true;
    process.env.JSON = true;

    expect(() => {
      program.parse('node test.js foo'.split(' '));
    }).toThrow(
      "error: environment variable 'JSON' cannot be used with environment variable 'SILENT'",
    );
  });

  test('should allow default value with a conflicting option', () => {
    const { program, actionMock } = makeProgram();

    program.commands[0].addOption(
      new commander.Option('-d, --debug', 'print debug logs')
        .default(true)
        .conflicts(['silent']),
    );

    program.parse('node test.js foo --silent'.split(' '));

    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith(
      { debug: true, silent: true },
      expect.any(Object),
    );
  });

  test('should report conflict on negated option flag', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red').conflicts(['color']))
      .addOption(new commander.Option('--color'))
      .addOption(new commander.Option('-N, --no-color'));

    expect(() => {
      program.parse('node test.js bar --red -N'.split(' '));
    }).toThrow(
      "error: option '--red' cannot be used with option '-N, --no-color'",
    );
  });

  test('should report conflict on negated option env variable', () => {
    const { program } = makeProgram();

    process.env.NO_COLOR = true;

    program
      .command('bar')
      .addOption(new commander.Option('--red').conflicts(['color']))
      .addOption(new commander.Option('--color'))
      .addOption(new commander.Option('-N, --no-color').env('NO_COLOR'));

    expect(() => {
      program.parse('node test.js bar --red'.split(' '));
    }).toThrow(
      "error: option '--red' cannot be used with environment variable 'NO_COLOR'",
    );
  });

  test('should report correct error for shorthand negated option', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('-N, --no-color').conflicts(['red']));

    expect(() => {
      program.parse('node test.js bar --red -N'.split(' '));
    }).toThrow(
      "error: option '-N, --no-color' cannot be used with option '--red'",
    );
  });

  test('should report correct error for positive option when negated is configured', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    expect(() => {
      program.parse('node test.js bar --red --dual'.split(' '));
    }).toThrow("error: option '--dual' cannot be used with option '--red'");
  });

  test('should report correct error for negated option when positive is configured', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    expect(() => {
      program.parse('node test.js bar --red --no-dual'.split(' '));
    }).toThrow("error: option '--no-dual' cannot be used with option '--red'");
  });

  test('should report correct error for positive env variable when negated is configured', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    process.env.DUAL = 'true';
    expect(() => {
      program.parse('node test.js bar --red'.split(' '));
    }).toThrow(
      "error: environment variable 'DUAL' cannot be used with option '--red'",
    );
  });

  test('should report correct error for negated env variable when positive is configured', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual').env('DUAL').conflicts(['red']))
      .addOption(new commander.Option('--no-dual').env('NO_DUAL'));

    process.env.NO_DUAL = 'true';
    expect(() => {
      program.parse('node test.js bar --red'.split(' '));
    }).toThrow(
      "error: environment variable 'NO_DUAL' cannot be used with option '--red'",
    );
  });

  test('should report correct error for positive option with string value when negated is configured', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual2 <str>').conflicts(['red']))
      .addOption(new commander.Option('--no-dual2').preset('BAD'));

    expect(() => {
      program.parse('node test.js bar --red --dual2 foo'.split(' '));
    }).toThrow(
      "error: option '--dual2 <str>' cannot be used with option '--red'",
    );
  });

  test('should report correct error for negated option with preset when negated is configured', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--red'))
      .addOption(new commander.Option('--dual2 <str>').conflicts(['red']))
      .addOption(new commander.Option('--no-dual2').preset('BAD'));

    expect(() => {
      program.parse('node test.js bar --red --no-dual2'.split(' '));
    }).toThrow("error: option '--no-dual2' cannot be used with option '--red'");
  });

  test('should not throw error when conflicts is invoked with a single string that includes another option', () => {
    const { program } = makeProgram();

    const actionMock = jest.fn();

    program
      .command('bar')
      .addOption(new commander.Option('--a'))
      .addOption(new commander.Option('--b').conflicts('aa'))
      .action(actionMock);

    program.parse('node test.js bar --a --b'.split(' '));

    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith(
      { a: true, b: true },
      expect.any(Object),
    );
  });

  test('should throw error when conflicts is invoked with a single string that equals another option', () => {
    const { program } = makeProgram();

    program
      .command('bar')
      .addOption(new commander.Option('--a'))
      .addOption(new commander.Option('--b').conflicts('a'));

    expect(() => {
      program.parse('node test.js bar --a --b'.split(' '));
    }).toThrow("error: option '--b' cannot be used with option '--a'");
  });

  test('when conflict on program calling action subcommand then throw conflict', () => {
    const { program } = makeProgram();
    let exception;

    program
      .addOption(new commander.Option('--black'))
      .addOption(new commander.Option('--white').conflicts('black'));

    try {
      program.parse('--white --black foo'.split(' '), { from: 'user' });
    } catch (err) {
      exception = err;
    }
    expect(exception).not.toBeUndefined();
    expect(exception.code).toBe('commander.conflictingOption');
  });

  test('when conflict on program calling action subcommand with help then show help', () => {
    const { program } = makeProgram();
    let exception;

    program
      .addOption(new commander.Option('--black'))
      .addOption(new commander.Option('--white').conflicts('black'));

    try {
      program.parse('--white --black foo --help'.split(' '), { from: 'user' });
    } catch (err) {
      exception = err;
    }
    expect(exception).not.toBeUndefined();
    expect(exception.code).toBe('commander.helpDisplayed');
  });

  test('when conflict on program calling external subcommand then throw conflict', () => {
    const { program } = makeProgram();
    let exception;

    program
      .addOption(new commander.Option('--black'))
      .addOption(new commander.Option('--white').conflicts('black'));
    const pm = path.join(__dirname, './fixtures/pm');
    program.command('ext', 'external command', { executableFile: pm });

    try {
      program.parse('--white --black ext'.split(' '), { from: 'user' });
    } catch (err) {
      exception = err;
    }
    expect(exception).not.toBeUndefined();
    expect(exception.code).toBe('commander.conflictingOption');
  });
});
