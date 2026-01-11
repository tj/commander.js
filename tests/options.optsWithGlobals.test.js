const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Testing optsWithGlobals and getOptionValueSourceWithGlobals with focus on globals.

describe('optsWithGlobals', () => {
  test('when variety of options used with program then opts is same as optsWithGlobals', () => {
    const program = new commander.Command();
    program
      .option('-b, --boolean')
      .option('-r, --require-value <value)')
      .option('-f, --float <value>', 'description', parseFloat)
      .option('-d, --default-value <value)', 'description', 'default value')
      .option('-n, --no-something');

    program.parse(['-b', '-r', 'req', '-f', '1e2'], { from: 'user' });
    assert.deepEqual(program.opts(), program.optsWithGlobals());
  });

  test('when options in sub and program then optsWithGlobals includes both', () => {
    const program = new commander.Command();
    let mergedOptions;
    program.option('-g, --global <value>');
    program
      .command('sub')
      .option('-l, --local <value)')
      .action((options, cmd) => {
        mergedOptions = cmd.optsWithGlobals();
      });

    program.parse(['-g', 'GGG', 'sub', '-l', 'LLL'], { from: 'user' });
    assert.deepEqual(mergedOptions, { global: 'GGG', local: 'LLL' });
  });

  test('when options in sub and subsub then optsWithGlobals includes both', () => {
    const program = new commander.Command();
    let mergedOptions;
    program
      .command('sub')
      .option('-g, --global <value)')
      .command('subsub')
      .option('-l, --local <value)')
      .action((options, cmd) => {
        mergedOptions = cmd.optsWithGlobals();
      });

    program.parse(['sub', '-g', 'GGG', 'subsub', '-l', 'LLL'], {
      from: 'user',
    });
    assert.deepEqual(mergedOptions, { global: 'GGG', local: 'LLL' });
  });

  test('when same named option in sub and program then optsWithGlobals includes global', () => {
    const program = new commander.Command();
    let mergedOptions;
    program.option('-c, --common <value>').enablePositionalOptions();
    program
      .command('sub')
      .option('-c, --common <value)')
      .action((options, cmd) => {
        mergedOptions = cmd.optsWithGlobals();
      });

    program.parse(['-c', 'GGG', 'sub', '-c', 'LLL'], { from: 'user' });
    assert.deepEqual(mergedOptions, { common: 'GGG' });
  });
});

describe('getOptionValueSourceWithGlobals', () => {
  test('when option used with simple command then source is defined', () => {
    const program = new commander.Command();
    program.option('-g, --global');

    program.parse(['-g'], { from: 'user' });
    assert.equal(program.getOptionValueSourceWithGlobals('global'), 'cli');
  });

  test('when option used with program then source is defined', () => {
    const program = new commander.Command();
    program.option('-g, --global');
    const sub = program
      .command('sub')
      .option('-l, --local')
      .action(() => {});

    program.parse(['sub', '-g'], { from: 'user' });
    assert.equal(sub.getOptionValueSourceWithGlobals('global'), 'cli');
  });

  test('when option used with subcommand then source is defined', () => {
    const program = new commander.Command();
    program.option('-g, --global');
    const sub = program
      .command('sub')
      .option('-l, --local')
      .action(() => {});

    program.parse(['sub', '-l'], { from: 'user' });
    assert.equal(sub.getOptionValueSourceWithGlobals('local'), 'cli');
  });

  test('when same named option in sub and program then source is defined by global', () => {
    const program = new commander.Command();
    program
      .enablePositionalOptions()
      .option('-c, --common <value>', 'description', 'default value');
    const sub = program
      .command('sub')
      .option('-c, --common <value>')
      .action(() => {});

    program.parse(['sub', '--common', 'value'], { from: 'user' });
    assert.equal(sub.getOptionValueSourceWithGlobals('common'), 'default');
  });
});
