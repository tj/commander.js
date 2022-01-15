const commander = require('../');

describe('command with exclusive options', () => {
  function makeProgram() {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program
      .exitOverride()
      .command('foo')
      .option('-s, --silent', "Don't print anything")
      .addOption(
        new commander.Option('-j, --json', 'Format output as json').exclusive([
          'silent'
        ])
      )
      .action(actionMock);

    return { program, actionMock };
  }

  test('should call action if there are no explicit exlucsive options set', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js foo --json'.split(' '));
    expect(actionMock).toHaveBeenCalledTimes(1);
    expect(actionMock).toHaveBeenCalledWith({ json: true }, expect.any(Object));
  });

  test('should call action when there are no implicit exlucsive options set', () => {
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
    }).toThrow("error: option '-j, --json' cannot be used with '-s, --silent'");
  });
});
