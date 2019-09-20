const commander = require('../');

test('when no arguments then asterisk action not called', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program
    .command('install')
    .action(mockAction);
  program.parse(['node', 'test']);
  expect(mockAction).not.toHaveBeenCalled();
});

test('when recognised command then asterisk action not called', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program
    .command('install')
    .action(() => { });
  program
    .action(mockAction);
  program.parse(['node', 'test', 'install']);
  expect(mockAction).not.toHaveBeenCalled();
});

test('when unrecognised command/argument then asterisk action called', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program
    .command('install');
  program
    .action(mockAction);
  program.parse(['node', 'test', 'unrecognised-command']);
  expect(mockAction).toHaveBeenCalled();
});
