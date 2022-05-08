const { Command, Option } = require('../');

describe('check priotities', () => {
  test('when source undefined and implied undefined then implied is undefined', () => {
    const program = new Command();
    program
      .addOption(new Option('--foo').implies({ bar: 'implied' }))
      .option('--bar');
    program.parse([], { from: 'user' });
    expect(program.opts()).toEqual({});
  });

  test('when source default and implied undefined then implied is undefined', () => {
    const program = new Command();
    program
      .addOption(new Option('--foo').implies({ bar: 'implied' }).default('default'))
      .option('--bar');
    program.parse([], { from: 'user' });
    expect(program.opts()).toEqual({ foo: 'default' });
  });

  test('when source from env and implied undefined then implied is implied', () => {
    const program = new Command();
    const envName = 'COMMANDER_TEST_DELETE_ME';
    process.env[envName] = 'env';
    program
      .addOption(new Option('--foo').implies({ bar: 'implied' }).env(envName))
      .option('--bar');
    program.parse([], { from: 'user' });
    expect(program.opts()).toEqual({ foo: true, bar: 'implied' });
    delete process.env[envName];
  });

  test('when source from cli and implied undefined then implied is implied', () => {
    const program = new Command();
    program
      .addOption(new Option('--foo').implies({ bar: 'implied' }))
      .option('--bar');
    program.parse(['--foo'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: true, bar: 'implied' });
  });

  test('when source cli and implied default then implied is implied', () => {
    const program = new Command();
    program
      .addOption(new Option('--foo').implies({ bar: 'implied' }))
      .option('--bar', '', 'default');
    program.parse(['--foo'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: true, bar: 'implied' });
  });

  test('when source cli and env default then implied is env', () => {
    const program = new Command();
    const envName = 'COMMANDER_TEST_DELETE_ME';
    process.env[envName] = 'env';
    program
      .addOption(new Option('--foo').implies({ bar: 'implied' }))
      .addOption(new Option('--bar <value>').env(envName));
    program.parse(['--foo'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: true, bar: 'env' });
    delete process.env[envName];
  });
});

// Can store a value that is not actually an option (!)

// Can store more than one implied key
