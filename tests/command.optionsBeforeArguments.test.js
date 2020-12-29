const commander = require('../');

describe('program with _passThroughOptions=true', () => {
  function makeProgram() {
    const program = new commander.Command();
    program._passThroughOptions = true;
    program
      .option('-d, --debug')
      .arguments('<args...>');
    return program;
  }

  test('when option before command-argument then option parsed', () => {
    const program = makeProgram();
    program.parse(['--debug', 'arg'], { from: 'user' });
    expect(program.args).toEqual(['arg']);
    expect(program.opts().debug).toBe(true);
  });

  test('when known option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.parse(['arg', '--debug'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--debug']);
    expect(program.opts().debug).toBeUndefined();
  });

  test('when unknown option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.parse(['arg', '--pass'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--pass']);
  });

  test('when action handler and unknown option after command-argument then option passed through', () => {
    const program = makeProgram();
    const mockAction = jest.fn();
    program.action(mockAction);
    program.parse(['arg', '--pass'], { from: 'user' });
    expect(mockAction).toHaveBeenCalledWith(['arg', '--pass'], program.opts(), program);
  });

  test('when help option (without command-argument) then help called', () => {
    const program = makeProgram();
    const mockHelp = jest.fn(() => '');

    program
      .exitOverride()
      .configureHelp({ formatHelp: mockHelp });
    try {
      program.parse(['--help'], { from: 'user' });
    } catch (err) {
    }
    expect(mockHelp).toHaveBeenCalled();
  });

  test('when help option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.parse(['arg', '--help'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--help']);
  });

  test('when version option after command-argument then option passed through', () => {
    const program = makeProgram();
    program.version('1.2.3');
    program.parse(['arg', '--version'], { from: 'user' });
    expect(program.args).toEqual(['arg', '--version']);
  });
});

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
    // also check which command calls help ????
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

// test for "foo sub" where sub is a parameter and not a command ????

// default command tests, including help

// Interaction of unknowns with passThrough.
