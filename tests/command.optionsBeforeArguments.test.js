const commander = require('../');

test('when default then option parsed after command-argument', () => {
  const program = new commander.Command();
  program
    .option('-d, --debug')
    .arguments('[arg]');
  program.parse(['arg', '--debug'], { from: 'user' });
  expect(program.opts().debug).toBe(true);
  expect(program.args).toEqual(['arg']);
});

// test('when optionsBeforeArguments then global option not parsed after command-argument', () => {
//   const program = new commander.Command();
//   program._optionsBeforeArguments = true;
//   program
//     .option('-d, --debug')
//     .arguments('[arg]');
//   program.parse(['arg', '--debug'], { from: 'user' });
//   expect(program.opts().debug).toBeUndefined();
//   expect(program.args).toEqual(['arg', '--debug']);
// });

test('when global option after subcommand and default then global option parsed', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program
    .option('-d, --debug');
  const sub = program.command('sub')
    .arguments('[arg]')
    .action(mockAction);
  program.parse(['sub', '--debug', 'arg'], { from: 'user' });
  expect(program.opts().debug).toBe(true);
  expect(mockAction).toBeCalledWith('arg', sub.opts(), sub);
});

test('when global option after subcommand and parseGlobalOptionsAnywhere(false) then global option not parsed', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program._parseGlobalOptionsAnywhere = false;
  program
    .option('-d, --debug');
  const sub = program.command('sub')
    .arguments('[arg]')
    .allowUnknownOption()
    .action(mockAction);
  program.parse(['sub', '--debug'], { from: 'user' });
  expect(program.opts().debug).toBeUndefined();
  expect(mockAction).toBeCalledWith('--debug', sub.opts(), sub);
});

test('when option after subcommand is global and local and parseGlobalOptionsAnywhere(false) then option parsed as local', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program._parseGlobalOptionsAnywhere = false;
  program
    .option('-d, --debug');
  const sub = program.command('sub')
    .option('-d, --debug')
    .action(mockAction);
  program.parse(['sub', '--debug'], { from: 'user' });
  expect(program.opts().debug).toBeUndefined();
  expect(sub.opts().debug).toBe(true);
});

// arg --help
// sub --help
// help sub
// default command, arg
