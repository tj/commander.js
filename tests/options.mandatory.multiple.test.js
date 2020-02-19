const commander = require('..');

// Assuming mandatory options behave as normal options apart from the mandatory aspect, not retesting all behaviour.
// Likewise, not redoing all tests on subcommand after testing on program.

describe('required program option with multiple mandatory values specified', () => {
  test('when program has required value specified then value as specified', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>+', 'cheese type');
    program.parse(['node', 'test', '--cheese', 'blue']);
    expect(program.cheese).toEqual(['blue']);
  });

  test('when program has option with name different than property then still recognised', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese-type <type>+', 'cheese type');
    program.parse(['node', 'test', '--cheese-type', 'blue']);
    expect(program.cheeseType).toEqual(['blue']);
  });

  test('when program has required value default then default value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>+', 'cheese type', 'default');
    program.parse(['node', 'test']);
    expect(program.cheese).toEqual(['default']);
  });

  test('when program has optional value flag specified then true', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese [type]+', 'cheese type');
    program.parse(['node', 'test', '--cheese']);
    expect(program.cheese).toEqual([true]);
  });

  test('when program has optional value default then default value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese [type]+', 'cheese type', 'default');
    program.parse(['node', 'test']);
    expect(program.cheese).toEqual(['default']);
  });

  test('when program has value/no flag specified with value then specified value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>+', 'cheese type')
      .requiredOption('--no-cheese', 'no cheese thanks');
    program.parse(['node', 'test', '--cheese', 'blue']);
    expect(program.cheese).toEqual(['blue']);
  });

  test('when program has yes/no flag specified negated then false', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>+', 'cheese type')
      .option('--no-cheese', 'no cheese thanks');
    program.parse(['node', 'test', '--no-cheese']);
    expect(program.cheese).toBe(false);
  });

  test('when program has required value specified and subcommand then specified value', () => {
    const program = new commander.Command();
    program
      .exitOverride()
      .requiredOption('--cheese <type>+', 'cheese type')
      .command('sub')
      .action(() => { });
    program.parse(['node', 'test', '--cheese', 'blue', 'sub']);
    expect(program.cheese).toEqual(['blue']);
  });
});

describe('required command option with multiple mandatory values specified', () => {
  test('when command has required value specified then specified value', () => {
    const program = new commander.Command();
    let cmdOptions;
    program
      .exitOverride()
      .command('sub')
      .requiredOption('--subby <type>+', 'description')
      .action((cmd) => {
        cmdOptions = cmd;
      });

    program.parse(['node', 'test', 'sub', '--subby', 'blue']);

    expect(cmdOptions.subby).toEqual(['blue']);
  });
});
