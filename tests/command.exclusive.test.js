const commander = require('../');

describe('command with exclusive options', () => {
  function makeProgram() {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .command('foo')
      .addOption(new commander.Option('-s, --silent', "Don't print anything").env('SILENT'))
      .addOption(
        new commander.Option('-j, --json', 'Format output as json').env('JSON').exclusive([
          'silent'
        ])
      )
      .action(actionMock);

    return { program, actionMock };
  }

  beforeEach(() => {
    delete process.env.SILENT;
    delete process.env.JSON;
  });

  test('should call action if there are no explicit exclusive options set', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js foo --json'.split(' '));
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith({ json: true }, expect.any(Object));
  });

  test('should call action when there are no implicit exclusive options set', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js foo --silent'.split(' '));
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith(
      { silent: true },
      expect.any(Object)
    );
  });

  test('should exit with error if exclusive options were set', () => {
    const { program } = makeProgram();

    expect(() => {
      program.parse('node test.js foo --silent --json'.split(' '));
    }).toThrow("error: option '-j, --json' cannot be used with option '-s, --silent'");
  });

  test('should report the env variable as the exclusive option source, when exclusive option is set', () => {
    const { program } = makeProgram();

    process.env.SILENT = true;

    expect(() => {
      program.parse('node test.js foo --json'.split(' '));
    }).toThrow("error: option '-j, --json' cannot be used with environment variable 'SILENT'");
  });

  test('should report the env variable as the configured option source, when configured option is set', () => {
    const { program } = makeProgram();

    process.env.JSON = true;

    expect(() => {
      program.parse('node test.js foo --silent'.split(' '));
    }).toThrow("error: environment variable 'JSON' cannot be used with option '-s, --silent'");
  });

  test('should report both env variables as sources, when configured option and exclusive option are set', () => {
    const { program } = makeProgram();

    process.env.SILENT = true;
    process.env.JSON = true;

    expect(() => {
      program.parse('node test.js foo'.split(' '));
    }).toThrow("error: environment variable 'JSON' cannot be used with environment variable 'SILENT'");
  });

  test('should exit with error if default value is conflicting', () => {
    const { program } = makeProgram();

    program.commands[0].addOption(new commander.Option('-d, --debug', 'print debug logs').default(true).exclusive('silent'));

    expect(() => {
      program.parse('node test.js foo --silent'.split(' '));
    }).toThrow("error: option 'debug' with default value cannot be used with option '-s, --silent'");
  });
});
