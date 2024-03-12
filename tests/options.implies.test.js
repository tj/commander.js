const { Command, Option } = require('../');

describe('check priorities', () => {
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
      .addOption(
        new Option('--foo').implies({ bar: 'implied' }).default('default'),
      )
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

test('when imply non-option then ok and stored', () => {
  const program = new Command();
  program.addOption(new Option('--foo').implies({ bar: 'implied' }));
  program.parse(['--foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: true, bar: 'implied' });
});

test('when imply multiple values then store multiple values', () => {
  const program = new Command();
  program
    .addOption(new Option('--foo').implies({ one: 'ONE', two: 'TWO' }))
    .option('--one')
    .option('--two');
  program.parse(['--foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: true, one: 'ONE', two: 'TWO' });
});

test('when imply multiple times then store multiple values', () => {
  const program = new Command();
  program
    .addOption(
      new Option('--foo').implies({ one: 'ONE' }).implies({ two: 'TWO' }),
    )
    .option('--one')
    .option('--two');
  program.parse(['--foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: true, one: 'ONE', two: 'TWO' });
});

test('when imply from positive option then positive implied', () => {
  const program = new Command();
  program
    .addOption(new Option('--foo').implies({ implied: 'POSITIVE' }))
    .addOption(new Option('--no-foo').implies({ implied: 'NEGATIVE' }));
  program.parse(['--foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: true, implied: 'POSITIVE' });
});

test('when imply from negative option then negative implied', () => {
  const program = new Command();
  program
    .addOption(new Option('--foo').implies({ implied: 'POSITIVE' }))
    .addOption(new Option('--no-foo').implies({ implied: 'NEGATIVE' }));
  program.parse(['--no-foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: false, implied: 'NEGATIVE' });
});

test('when imply from lone negative option then negative implied', () => {
  const program = new Command();
  program.addOption(new Option('--no-foo').implies({ implied: 'NEGATIVE' }));
  program.parse(['--no-foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: false, implied: 'NEGATIVE' });
});

test('when imply from negative option with preset then negative implied', () => {
  const program = new Command();
  program
    .addOption(new Option('--foo').implies({ implied: 'POSITIVE' }))
    .addOption(
      new Option('--no-foo').implies({ implied: 'NEGATIVE' }).preset('FALSE'),
    );
  program.parse(['--no-foo'], { from: 'user' });
  expect(program.opts()).toEqual({ foo: 'FALSE', implied: 'NEGATIVE' });
});

test('when chained implies then only explicitly trigger', () => {
  const program = new Command();
  program
    .addOption(new Option('--one').implies({ two: true }))
    .addOption(new Option('--two').implies({ three: true }))
    .addOption(new Option('--three'));
  program.parse(['--one'], { from: 'user' });
  expect(program.opts()).toEqual({ one: true, two: true });
});

test('when looped implies then no infinite loop', () => {
  const program = new Command();
  program
    .addOption(new Option('--ying').implies({ yang: true }))
    .addOption(new Option('--yang').implies({ ying: true }));
  program.parse(['--ying'], { from: 'user' });
  expect(program.opts()).toEqual({ ying: true, yang: true });
});

test('when conflict with implied value then throw', () => {
  const program = new Command();
  program
    .exitOverride()
    .configureOutput({
      writeErr: () => {},
    })
    .addOption(new Option('--unary'))
    .addOption(new Option('--binary').conflicts('unary'))
    .addOption(new Option('--one').implies({ unary: true }));

  expect(() => {
    program.parse(['--binary', '--one'], { from: 'user' });
  }).toThrow();
});

test('when requiredOption with implied value then not throw', () => {
  const program = new Command();
  program
    .requiredOption('--target <target-file>')
    .addOption(
      new Option('--default-target').implies({ target: 'default-file' }),
    );

  expect(() => {
    program.parse(['--default-target'], { from: 'user' });
  }).not.toThrow();
});

test('when implies on program and use subcommand then program updated', () => {
  const program = new Command();
  program.addOption(new Option('--foo').implies({ bar: 'implied' }));
  program.command('sub').action(() => {});
  program.parse(['--foo', 'sub'], { from: 'user' });
  expect(program.opts().bar).toEqual('implied');
});

test('when option with implies used multiple times then implied gets single value', () => {
  const program = new Command();
  program
    .addOption(new Option('--foo').implies({ bar: 'implied' }))
    .option('-b, --bar <value...>');
  program.parse(['--foo', '--foo'], { from: 'user' });
  expect(program.opts().bar).toEqual('implied');
});

test('when implied option has custom processing then custom processing not called', () => {
  let called = false;
  const program = new Command();
  program
    .addOption(new Option('--foo').implies({ bar: true }))
    .option('-b, --bar', 'description', () => {
      called = true;
    });
  program.parse(['--foo'], { from: 'user' });
  expect(program.opts().bar).toEqual(true);
  expect(called).toEqual(false);
});

test('when passed string then treat as boolean', () => {
  // Do something sensible instead of something silly if user passes just name of option.
  // https://github.com/tj/commander.js/issues/1852
  const program = new Command();
  program
    .addOption(new Option('--foo').implies('bar'))
    .option('-b, --bar', 'description');
  program.parse(['--foo'], { from: 'user' });
  expect(program.opts().bar).toEqual(true);
});
