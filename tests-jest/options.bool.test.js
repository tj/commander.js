const commander = require('../');

// Test simple flag and negatable flag

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
