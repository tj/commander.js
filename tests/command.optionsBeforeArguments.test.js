const commander = require('../');

test('when option after argument then option parsed', () => {
  const program = new commander.Command();
  program
    .option('-d, --debug')
    .arguments('[arg]');
  program.parse(['arg', '--debug'], { from: 'user' });
  expect(program.opts().debug).toBe(true);
  expect(program.args).toEqual(['arg']);
});

test('when option after argument and passThroughOptions=true then option not parsed', () => {
  const program = new commander.Command();
  program._passThroughOptions = true;
  program
    .option('-d, --debug')
    .arguments('[arg]');
  program.parse(['arg', '--debug'], { from: 'user' });
  expect(program.opts().debug).toBeUndefined();
  expect(program.args).toEqual(['arg', '--debug']);
});

// This shows bug, parsing of the "known" at the top level ate the argument before parsing by the subcommand.
// Could require that global parsing is off, to get pass-through?
// test('BUG: when option after subcommand argument and passThroughOptions=true then option not parsed', () => {
//   const program = new commander.Command();
//   const sub = program.command('sub')
//     .option('-d, --debug')
//     .arguments('<arg>');
//   sub._passThroughOptions = true;
//   program.parse(['sub', 'arg', '--debug'], { from: 'user' });
//   expect(sub.opts().debug).toBeUndefined();
//   expect(sub.args).toEqual(['arg', '--debug']);
// });

test('when global option after subcommand then global option parsed', () => {
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

test('when global option after subcommand and _enablePositionalOptions=true then global option not parsed', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program._enablePositionalOptions = true;
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

test('when option after subcommand is global and local and _enablePositionalOptions=true then option parsed as local', () => {
  const mockAction = jest.fn();
  const program = new commander.Command();
  program._enablePositionalOptions = true;
  program
    .option('-d, --debug');
  const sub = program.command('sub')
    .option('-d, --debug')
    .action(mockAction);
  program.parse(['sub', '--debug'], { from: 'user' });
  expect(program.opts().debug).toBeUndefined();
  expect(sub.opts().debug).toBe(true);
});

describe('program with _enablePositionalOptions=true and subcommand with _passThroughOptions=true', () => {
  test.each([
    [[], true],
    [['help'], true],
    [['--help'], true],
    [['sub'], false],
    [['sub', '--help'], true],
    [['sub', 'foo', '--help'], false]
  ])('when user args %p then help called is %p', (userArgs, expectHelpCalled) => {
    const program = new commander.Command();
    program._enablePositionalOptions = true;
    program
      .exitOverride()
      .configureHelp({ formatHelp: () => '' });
    const sub = program.command('sub')
      .exitOverride()
      .configureHelp({ formatHelp: () => '' })
      .action(() => { });
    sub._passThroughOptions = true;

    let helpCalled = false;
    try {
      program.parse(userArgs, { from: 'user' });
    } catch (err) {
      helpCalled = err.code === 'commander.helpDisplayed' || err.code === 'commander.help';
    }
    expect(helpCalled).toEqual(expectHelpCalled);
  });
});
