const commander = require('../');

// Test simple flag and negatable flag

// boolean flag on program
describe('boolean flag on program', () => {
  test('when boolean flag not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test']);
    expect(program.pepper).toBeUndefined();
  });

  test('when boolean flag specified then value is true', () => {
    const program = new commander.Command();
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    expect(program.pepper).toBe(true);
  });

  test('when negatable boolean flag not specified then value is true', () => {
    const program = new commander.Command();
    program
      .option('--no-cheese', 'remove cheese');
    program.parse(['node', 'test']);
    expect(program.cheese).toBe(true);
  });

  test('when negatable boolean flag specified then value is false', () => {
    const program = new commander.Command();
    program
      .option('--no-cheese', 'remove cheese');
    program.parse(['node', 'test', '--no-cheese']);
    expect(program.cheese).toBe(false);
  });
});

// boolean flag on command
describe('boolean flag on command', () => {
  test('when boolean flag not specified then value is undefined', () => {
    let subCommand;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--pepper', 'add pepper')
      .action((cmd) => { subCommand = cmd; });
    program.parse(['node', 'test', 'sub']);
    expect(subCommand.pepper).toBeUndefined();
  });

  test('when boolean flag specified then value is true', () => {
    let subCommand;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--pepper', 'add pepper')
      .action((cmd) => { subCommand = cmd; });
    program.parse(['node', 'test', 'sub', '--pepper']);
    expect(subCommand.pepper).toBe(true);
  });

  test('when negatable boolean flag not specified then value is true', () => {
    let subCommand;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--no-cheese', 'remove cheese')
      .action((cmd) => { subCommand = cmd; });
    program.parse(['node', 'test', 'sub']);
    expect(subCommand.cheese).toBe(true);
  });

  test('when negatable boolean flag specified then value is false', () => {
    let subCommand;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--no-cheese', 'remove cheese')
      .action((cmd) => { subCommand = cmd; });
    program.parse(['node', 'test', 'sub', '--no-cheese']);
    expect(subCommand.cheese).toBe(false);
  });
});

// This is a somewhat undocumented special behaviour which appears in some examples.
// When a flag has a non-boolean default, it is used as the value (only) when the flag is specified.
//
// boolean flag with non-boolean default
describe('boolean flag with non-boolean default', () => {
  test('when flag not specified then value is undefined', () => {
    const flagValue = 'black';
    const program = new commander.Command();
    program
      .option('--olives', 'Add olives? Sorry we only have black.', flagValue);
    program.parse(['node', 'test']);
    expect(program.olives).toBeUndefined();
  });

  test('when flag specified then value is "default" value', () => {
    const flagValue = 'black';
    const program = new commander.Command();
    program
      .option('-v, --olives', 'Add olives? Sorry we only have black.', flagValue);
    program.parse(['node', 'test', '--olives']);
    expect(program.olives).toBe(flagValue);
  });
});

// Regression test for #1301 with `-no-` in middle of option
describe('regression test for -no- in middle of option flag', () => {
  test('when flag not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--module-no-parse');
    program.parse(['node', 'test']);
    expect(program.moduleNoParse).toBeUndefined();
  });

  test('when flag specified then value is true', () => {
    const program = new commander.Command();
    program
      .option('--module-no-parse');
    program.parse(['node', 'test', '--module-no-parse']);
    expect(program.moduleNoParse).toEqual(true);
  });
});
