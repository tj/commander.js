const commander = require('../');

// Test simple flag and negatable flag

// boolean flag on program
describe('boolean flag on program', () => {
  test('when boolean flag not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test']);
    expect(program.opts().pepper).toBeUndefined();
  });

  test('when boolean flag specified then value is true', () => {
    const program = new commander.Command();
    program
      .option('--pepper', 'add pepper');
    program.parse(['node', 'test', '--pepper']);
    expect(program.opts().pepper).toBe(true);
  });

  test('when negatable boolean flag not specified then value is true', () => {
    const program = new commander.Command();
    program
      .option('--no-cheese', 'remove cheese');
    program.parse(['node', 'test']);
    expect(program.opts().cheese).toBe(true);
  });

  test('when negatable boolean flag specified then value is false', () => {
    const program = new commander.Command();
    program
      .option('--no-cheese', 'remove cheese');
    program.parse(['node', 'test', '--no-cheese']);
    expect(program.opts().cheese).toBe(false);
  });
});

// boolean flag on command
describe('boolean flag on command', () => {
  test('when boolean flag not specified then value is undefined', () => {
    let subCommandOptions;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--pepper', 'add pepper')
      .action((options) => { subCommandOptions = options; });
    program.parse(['node', 'test', 'sub']);
    expect(subCommandOptions.pepper).toBeUndefined();
  });

  test('when boolean flag specified then value is true', () => {
    let subCommandOptions;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--pepper', 'add pepper')
      .action((options) => { subCommandOptions = options; });
    program.parse(['node', 'test', 'sub', '--pepper']);
    expect(subCommandOptions.pepper).toBe(true);
  });

  test('when negatable boolean flag not specified then value is true', () => {
    let subCommandOptions;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--no-cheese', 'remove cheese')
      .action((options) => { subCommandOptions = options; });
    program.parse(['node', 'test', 'sub']);
    expect(subCommandOptions.cheese).toBe(true);
  });

  test('when negatable boolean flag specified then value is false', () => {
    let subCommandOptions;
    const program = new commander.Command();
    program
      .command('sub')
      .option('--no-cheese', 'remove cheese')
      .action((options) => { subCommandOptions = options; });
    program.parse(['node', 'test', 'sub', '--no-cheese']);
    expect(subCommandOptions.cheese).toBe(false);
  });
});

// boolean flag with non-boolean default
// NB: behaviour changed in Commander v9 to have default be default.
// These tests no longer match likely uses, but retained and updated to match current behaviour.
describe('boolean flag with non-boolean default', () => {
  test('when flag not specified then value is "default"', () => {
    const flagValue = 'black';
    const program = new commander.Command();
    program
      .option('--olives', 'Add green olives?', flagValue);
    program.parse(['node', 'test']);
    expect(program.opts().olives).toBe(flagValue);
  });

  test('when flag specified then value is true', () => {
    const flagValue = 'black';
    const program = new commander.Command();
    program
      .option('-v, --olives', 'Add green olives?', flagValue);
    program.parse(['node', 'test', '--olives']);
    expect(program.opts().olives).toBe(true);
  });

  test('when combo flag and negated then value is false', () => {
    const flagValue = 'black';
    const program = new commander.Command();
    program
      .option('-v, --olives', 'Add green olives?', flagValue)
      .option('--no-olives');
    program.parse(['node', 'test', '--olives', '--no-olives']);
    expect(program.opts().olives).toBe(false);
  });
});

// Regression test for #1301 with `-no-` in middle of option
describe('regression test for -no- in middle of option flag', () => {
  test('when flag not specified then value is undefined', () => {
    const program = new commander.Command();
    program
      .option('--module-no-parse');
    program.parse(['node', 'test']);
    expect(program.opts().moduleNoParse).toBeUndefined();
  });

  test('when flag specified then value is true', () => {
    const program = new commander.Command();
    program
      .option('--module-no-parse');
    program.parse(['node', 'test', '--module-no-parse']);
    expect(program.opts().moduleNoParse).toEqual(true);
  });
});
