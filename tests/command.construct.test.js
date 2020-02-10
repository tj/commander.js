const commander = require('../');

test('when pass construct option then it is used for creating command', () => {
  const program = new commander.Command();
  const construct = (name) => {
    const cmd = new commander.Command(name);
    cmd.custom = 'value';
    return cmd;
  };
  const cmd = program
    .command('secret', { construct });
  expect(cmd).toHaveProperty('custom', 'value');
});
