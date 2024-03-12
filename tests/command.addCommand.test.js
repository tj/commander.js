const commander = require('../');

// simple sanity check subcommand works
test('when addCommand and specify subcommand then called', () => {
  const program = new commander.Command();
  const leafAction = jest.fn();
  const sub = new commander.Command();
  sub.name('sub').action(leafAction);
  program.addCommand(sub);

  program.parse('node test.js sub'.split(' '));
  expect(leafAction).toHaveBeenCalled();
});

test('when commands added using .addCommand and .command then internals similar', () => {
  const program1 = new commander.Command();
  program1.command('sub');
  const program2 = new commander.Command();
  program2.addCommand(new commander.Command('sub'));

  // This is a bit of a cheat to check using .addCommand() produces similar result to .command(),
  // since .command() is well tested and understood.

  const cmd1 = program1.commands[0];
  const cmd2 = program2.commands[0];
  expect(cmd1.parent).toBe(program1);
  expect(cmd2.parent).toBe(program2);

  for (const key of Object.keys(cmd1)) {
    switch (typeof cmd1[key]) {
      case 'string':
      case 'boolean':
      case 'number':
      case 'undefined':
        // Compare values in a way that will be readable in test failure message.
        // eslint-disable-next-line jest/no-conditional-expect
        expect(`${key}:${cmd1[key]}`).toEqual(`${key}:${cmd2[key]}`);
        break;
    }
  }
});

test('when command without name passed to .addCommand then throw', () => {
  const program = new commander.Command();
  const cmd = new commander.Command();
  expect(() => {
    program.addCommand(cmd);
  }).toThrow();
});

test('when executable command with custom executableFile passed to .addCommand then ok', () => {
  const program = new commander.Command();
  const cmd = new commander.Command('sub');
  cmd.command('exec', 'exec description', { executableFile: 'custom' });
  expect(() => {
    program.addCommand(cmd);
  }).not.toThrow();
});
