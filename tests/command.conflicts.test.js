const commander = require('../');

describe('command with conflicting options', () => {
  function makeProgram() {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .command('foo')
      .addOption(new commander.Option('-s, --silent', "Don't print anything").env('SILENT'))
      .addOption(
        new commander.Option('-j, --json', 'Format output as json').env('JSON').conflicts([
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
      expect.any(Object)
    );
  });

  test('should exit with error if conflicting options were set', () => {
    const { program } = makeProgram();

    expect(() => {
      program.parse('node test.js foo --silent --json'.split(' '));
    }).toThrow("error: option '-j, --json' cannot be used with option '-s, --silent'");
  });

  test('should report the env variable as the conflicting option source, when conflicting option is set', () => {
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

  test('should report both env variables as sources, when configured option and conflicting option are set', () => {
    const { program } = makeProgram();

    process.env.SILENT = true;
    process.env.JSON = true;

    expect(() => {
      program.parse('node test.js foo'.split(' '));
    }).toThrow("error: environment variable 'JSON' cannot be used with environment variable 'SILENT'");
  });

  test('should allow default value with a conflicting option', () => {
    const { program, actionMock } = makeProgram();

    program.commands[0].addOption(new commander.Option('-d, --debug', 'print debug logs').default(true).conflicts(['silent']));

    program.parse('node test.js foo --silent'.split(' '));

    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith({ debug: true, silent: true }, expect.any(Object));
  });
});
