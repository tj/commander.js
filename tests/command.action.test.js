const commander = require('../');

// Test some behaviours of .action not covered in more specific tests.

test('when .action called then command passed to action', () => {
  const actionMock = jest.fn();
  const program = new commander.Command();
  const cmd = program
    .command('info')
    .action(actionMock);
  program.parse(['node', 'test', 'info']);
  expect(actionMock).toHaveBeenCalledWith(cmd);
});

test('when .action called then program.args only contains args', () => {
  // At one time program.args was being modified to contain the same args as the call to .action
  // and so included the command as an extra and unexpected complex item in array.
  const program = new commander.Command();
  program
    .command('info <file>')
    .action(() => {});
  program.parse(['node', 'test', 'info', 'my-file']);
  expect(program.args).toEqual(['my-file']);
});

test('when .action called with extra arguments then extras also passed to action', () => {
  // This is a new and undocumented behaviour for now.
  // Might make this an error by default in future.
  const actionMock = jest.fn();
  const program = new commander.Command();
  const cmd = program
    .command('info <file>')
    .action(actionMock);
  program.parse(['node', 'test', 'info', 'my-file', 'a']);
  expect(actionMock).toHaveBeenCalledWith('my-file', cmd, ['a']);
});
