const commander = require('../');

test('when add subcommand with .command() then calls copySettings from parent', () => {
  const program = new commander.Command();

  // This is a bit intrusive, but check that copySettings is called internally.
  const copySettingMock = jest.fn();
  program.createCommand = (name) => {
    const cmd = new commander.Command(name);
    cmd.copySettings = copySettingMock;
    return cmd;
  };
  program.command('sub');

  expect(copySettingMock).toHaveBeenCalledWith(program);
});

describe('copySettings property tests', () => {
  test('outputConfiguration', () => {
    const source = new commander.Command();
    source.configureOutput({ foo: 'bar' });
    const cmd = new commander.Command();
    cmd.copySettings(source);
    expect(cmd.configureOutput().foo).toEqual('bar');
  });
});
