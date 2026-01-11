const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Testing some Electron conventions but not directly using Electron to avoid overheads.
// https://github.com/electron/electron/issues/4690#issuecomment-217435222
// https://www.electronjs.org/docs/api/process#processdefaultapp-readonly

// (If mutating process.argv and process.execArgv causes problems, could add utility
// functions to get them and then mock the functions for tests.)

describe('.parse() args from', () => {
  test('when no args then use process.argv and app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    const hold = process.argv;
    process.argv = 'node script.js user'.split(' ');
    program.parse();
    process.argv = hold;
    assert.deepEqual(program.args, ['user']);
  });

  test('when no args and electron properties and not default app then use process.argv and app/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    const holdArgv = process.argv;
    process.versions.electron = '1.2.3';
    process.argv = 'node user'.split(' ');
    program.parse();
    delete process.versions.electron;
    process.argv = holdArgv;
    assert.deepEqual(program.args, ['user']);
  });

  test('when args then app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.parse('node script.js user'.split(' '));
    assert.deepEqual(program.args, ['user']);
  });

  test('when args from "node" then app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.parse('node script.js user'.split(' '), { from: 'node' });
    assert.deepEqual(program.args, ['user']);
  });

  test('when args from "electron" and not default app then app/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    const hold = process.defaultApp;
    process.defaultApp = undefined;
    program.parse('customApp user'.split(' '), { from: 'electron' });
    process.defaultApp = hold;
    assert.deepEqual(program.args, ['user']);
  });

  test('when args from "electron" and default app then app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    const hold = process.defaultApp;
    process.defaultApp = true;
    program.parse('electron script user'.split(' '), { from: 'electron' });
    process.defaultApp = hold;
    assert.deepEqual(program.args, ['user']);
  });

  test('when args from "user" then args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.parse('user'.split(' '), { from: 'user' });
    assert.deepEqual(program.args, ['user']);
  });

  test('when args from "silly" then throw', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    assert.throws(() => {
      program.parse(['node', 'script.js'], { from: 'silly' });
    });
  });

  describe('when node execArgv includes node flags', () => {
    ['-e', '--eval', '-p', '--print'].forEach((flag) => {
      test(`when node execArgv includes ${flag} then app/args`, () => {
        const program = new commander.Command();
        program.argument('[args...]');
        const holdExecArgv = process.execArgv;
        const holdArgv = process.argv;
        process.argv = ['node', 'user-arg'];
        process.execArgv = [flag, 'console.log("hello, world")'];
        program.parse();
        process.argv = holdArgv;
        process.execArgv = holdExecArgv;
        assert.deepEqual(program.args, ['user-arg']);
        process.execArgv = holdExecArgv;
      });
    });
  });
});

describe('return type', () => {
  test('when call .parse then returns program', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.action(() => {});

    const result = program.parse(['node', 'test']);
    assert.equal(result, program);
  });

  test('when await .parseAsync then returns program', async () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.action(() => {});

    const result = await program.parseAsync(['node', 'test']);
    assert.equal(result, program);
  });
});

// Easy mistake to make when writing unit tests
test('when parse strings instead of array then throw', () => {
  const program = new commander.Command();
  program.argument('[args...]');
  assert.throws(() => {
    program.parse('node', 'test');
  });
});

describe('parse parameter is treated as readonly, per TypeScript declaration', () => {
  test('when parse called then parameter does not change', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    program.parse(param);
    assert.deepEqual(param, original);
  });

  test('when parse called and parsed args later changed then parameter does not change', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    program.parse(param);
    program.args.length = 0;
    program.rawArgs.length = 0;
    assert.deepEqual(param, original);
  });

  test('when parse called and param later changed then parsed args do not change', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const param = ['node', '--debug', 'arg'];
    program.parse(param);
    const oldArgs = program.args.slice();
    const oldRawArgs = program.rawArgs.slice();
    param.length = 0;
    assert.deepEqual(program.args, oldArgs);
    assert.deepEqual(program.rawArgs, oldRawArgs);
  });
});

describe('parseAsync parameter is treated as readonly, per TypeScript declaration', () => {
  test('when parse called then parameter does not change', async () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    await program.parseAsync(param);
    assert.deepEqual(param, original);
  });

  test('when parseAsync called and parsed args later changed then parameter does not change', async () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    await program.parseAsync(param);
    program.args.length = 0;
    program.rawArgs.length = 0;
    assert.deepEqual(param, original);
  });

  test('when parseAsync called and param later changed then parsed args do not change', async () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const param = ['node', '--debug', 'arg'];
    await program.parseAsync(param);
    const oldArgs = program.args.slice();
    const oldRawArgs = program.rawArgs.slice();
    param.length = 0;
    assert.deepEqual(program.args, oldArgs);
    assert.deepEqual(program.rawArgs, oldRawArgs);
  });
});

describe('.parse() called multiple times', () => {
  test('when use boolean options then option values reset', () => {
    const program = new commander.Command().option('--black').option('--white');

    program.parse(['--black'], { from: 'user' });
    assert.deepEqual(program.opts(), { black: true });

    program.parse(['--white'], { from: 'user' });
    assert.deepEqual(program.opts(), { white: true });
  });

  test('when use options with option-argument then option values and sources reset', () => {
    const program = new commander.Command()
      .option('-f, --foo <value>')
      .option('-b, --bar <value>');

    program.parse(['--foo', 'FOO'], { from: 'user' });
    assert.deepEqual(program.opts(), { foo: 'FOO' });
    assert.equal(program.getOptionValueSource('foo'), 'cli');
    assert.equal(program.getOptionValueSource('bar'), undefined);

    program.parse(['--bar', 'BAR'], { from: 'user' });
    assert.deepEqual(program.opts(), { bar: 'BAR' });
    assert.equal(program.getOptionValueSource('foo'), undefined);
    assert.equal(program.getOptionValueSource('bar'), 'cli');
  });

  test('when use options with option-argument and default then option values and sources reset', () => {
    const program = new commander.Command()
      .option('-f, --foo <value>', 'description', 'default-FOO')
      .option('-b, --bar <value>', 'description', 'default-BAR');

    program.parse(['--foo', 'FOO'], { from: 'user' });
    assert.deepEqual(program.opts(), { foo: 'FOO', bar: 'default-BAR' });
    assert.equal(program.getOptionValueSource('foo'), 'cli');
    assert.equal(program.getOptionValueSource('bar'), 'default');

    program.parse(['--bar', 'BAR'], { from: 'user' });
    assert.deepEqual(program.opts(), { foo: 'default-FOO', bar: 'BAR' });
    assert.equal(program.getOptionValueSource('foo'), 'default');
    assert.equal(program.getOptionValueSource('bar'), 'cli');
  });

  test('when use negated options then option values reset', () => {
    const program = new commander.Command()
      .option('--no-foo')
      .option('--no-bar');

    program.parse(['--no-foo'], { from: 'user' });
    assert.deepEqual(program.opts(), { foo: false, bar: true });

    program.parse(['--no-bar'], { from: 'user' });
    assert.deepEqual(program.opts(), { foo: true, bar: false });
  });

  test('when use variadic option then option values reset', () => {
    const program = new commander.Command().option('--var <items...>');

    program.parse(['--var', 'a', 'b'], { from: 'user' });
    assert.deepEqual(program.opts(), { var: ['a', 'b'] });

    program.parse(['--var', 'c'], { from: 'user' });
    assert.deepEqual(program.opts(), { var: ['c'] });
  });

  test('when use collect example then option value resets', () => {
    function collect(value, previous) {
      return previous.concat([value]);
    }
    const program = new commander.Command();
    program.option('-c, --collect <value>', 'repeatable value', collect, []);

    program.parse(['-c', 'a', '-c', 'b'], { from: 'user' });
    assert.deepEqual(program.opts(), { collect: ['a', 'b'] });

    program.parse(['-c', 'c'], { from: 'user' });
    assert.deepEqual(program.opts(), { collect: ['c'] });
  });

  test('when use increaseVerbosity example then option value resets', () => {
    function increaseVerbosity(dummyValue, previous) {
      return previous + 1;
    }
    const program = new commander.Command();
    program.option(
      '-v, --verbose',
      'verbosity that can be increased',
      increaseVerbosity,
      0,
    );

    program.parse(['-vvv'], { from: 'user' });
    assert.deepEqual(program.opts(), { verbose: 3 });
    program.parse(['-vv'], { from: 'user' });

    assert.deepEqual(program.opts(), { verbose: 2 });
    program.parse([], { from: 'user' });
    assert.deepEqual(program.opts(), { verbose: 0 });
  });

  test('when use parse and parseAsync then option values reset', async () => {
    const program = new commander.Command().option('--black').option('--white');

    program.parse(['--black'], { from: 'user' });
    assert.deepEqual(program.opts(), { black: true });
    await program.parseAsync(['--white'], { from: 'user' });
    assert.deepEqual(program.opts(), { white: true });
  });

  test('when call subcommand then option values reset (program and subcommand)', () => {
    const program = new commander.Command().option('--black').option('--white');
    const subcommand = program.command('sub').option('--red').option('--green');

    program.parse(['--black', 'sub', '--red'], { from: 'user' });
    assert.deepEqual(subcommand.optsWithGlobals(), { black: true, red: true });

    program.parse(['--white', 'sub', '--green'], { from: 'user' });
    assert.deepEqual(subcommand.optsWithGlobals(), {
      white: true,
      green: true,
    });
  });

  test('when call different subcommand then no reset because lazy', () => {
    // This is not a required behaviour, but is the intended behaviour.
    const program = new commander.Command();
    const sub1 = program.command('sub1').option('--red');
    const sub2 = program.command('sub2').option('--green');

    program.parse(['sub1', '--red'], { from: 'user' });
    assert.deepEqual(sub1.opts(), { red: true });
    assert.deepEqual(sub2.opts(), {});

    program.parse(['sub2', '--green'], { from: 'user' });
    assert.deepEqual(sub1.opts(), { red: true });
    assert.deepEqual(sub2.opts(), { green: true });
  });

  test('when parse with different implied program name then name changes', () => {
    const program = new commander.Command();

    program.parse(['node', 'script1.js']);
    assert.equal(program.name(), 'script1');

    program.parse(['electron', 'script2.js']);
    assert.equal(program.name(), 'script2');
  });

  test('when parse with different arguments then args change', () => {
    // weak test, would work without store/reset!
    const program = new commander.Command()
      .argument('<first>')
      .argument('[second]');

    program.parse(['one', 'two'], { from: 'user' });
    assert.deepEqual(program.args, ['one', 'two']);

    program.parse(['alpha'], { from: 'user' });
    assert.deepEqual(program.args, ['alpha']);
  });

  test('when parse with different arguments then rawArgs change', () => {
    // weak test, would work without store/reset!
    const program = new commander.Command()
      .argument('<first>')
      .option('--white')
      .option('--black');

    program.parse(['--white', 'one'], { from: 'user' });
    assert.deepEqual(program.rawArgs, ['--white', 'one']);

    program.parse(['--black', 'two'], { from: 'user' });
    assert.deepEqual(program.rawArgs, ['--black', 'two']);
  });

  test('when parse with different arguments then processedArgs change', () => {
    // weak test, would work without store/reset!
    const program = new commander.Command().argument(
      '<first>',
      'first arg',
      parseFloat,
    );

    program.parse([123], { from: 'user' });
    assert.deepEqual(program.processedArgs, [123]);

    program.parse([456], { from: 'user' });
    assert.deepEqual(program.processedArgs, [456]);
  });

  test('when parse subcommand then reset state before preSubcommand hook called', () => {
    let hookCalled = false;
    const program = new commander.Command().hook(
      'preSubcommand',
      (thisCommand, subcommand) => {
        hookCalled = true;
        assert.deepEqual(subcommand.opts(), {});
      },
    );
    const subcommand = program.command('sub').option('--red').option('--green');

    hookCalled = false;
    program.parse(['sub', '--red'], { from: 'user' });
    assert.equal(hookCalled, true);
    assert.deepEqual(subcommand.opts(), { red: true });

    hookCalled = false;
    program.parse(['sub', '--green'], { from: 'user' });
    assert.equal(hookCalled, true);
    assert.deepEqual(subcommand.opts(), { green: true });
  });

  test('when using storeOptionsAsProperties then throw on second parse', () => {
    const program = new commander.Command().storeOptionsAsProperties();
    program.parse();
    assert.throws(() => {
      program.parse();
    });
  });
});
