const commander = require('../');

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
    expect(program.args).toEqual(['user']);
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
    expect(program.args).toEqual(['user']);
  });

  test('when args then app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.parse('node script.js user'.split(' '));
    expect(program.args).toEqual(['user']);
  });

  test('when args from "node" then app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.parse('node script.js user'.split(' '), { from: 'node' });
    expect(program.args).toEqual(['user']);
  });

  test('when args from "electron" and not default app then app/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    const hold = process.defaultApp;
    process.defaultApp = undefined;
    program.parse('customApp user'.split(' '), { from: 'electron' });
    process.defaultApp = hold;
    expect(program.args).toEqual(['user']);
  });

  test('when args from "electron" and default app then app/script/args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    const hold = process.defaultApp;
    process.defaultApp = true;
    program.parse('electron script user'.split(' '), { from: 'electron' });
    process.defaultApp = hold;
    expect(program.args).toEqual(['user']);
  });

  test('when args from "user" then args', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.parse('user'.split(' '), { from: 'user' });
    expect(program.args).toEqual(['user']);
  });

  test('when args from "silly" then throw', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    expect(() => {
      program.parse(['node', 'script.js'], { from: 'silly' });
    }).toThrow();
  });

  test.each(['-e', '--eval', '-p', '--print'])(
    'when node execArgv includes %s then app/args',
    (flag) => {
      const program = new commander.Command();
      program.argument('[args...]');
      const holdExecArgv = process.execArgv;
      const holdArgv = process.argv;
      process.argv = ['node', 'user-arg'];
      process.execArgv = [flag, 'console.log("hello, world")'];
      program.parse();
      process.argv = holdArgv;
      process.execArgv = holdExecArgv;
      expect(program.args).toEqual(['user-arg']);
      process.execArgv = holdExecArgv;
    },
  );
});

describe('return type', () => {
  test('when call .parse then returns program', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.action(() => {});

    const result = program.parse(['node', 'test']);
    expect(result).toBe(program);
  });

  test('when await .parseAsync then returns program', async () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.action(() => {});

    const result = await program.parseAsync(['node', 'test']);
    expect(result).toBe(program);
  });
});

// Easy mistake to make when writing unit tests
test('when parse strings instead of array then throw', () => {
  const program = new commander.Command();
  program.argument('[args...]');
  expect(() => {
    program.parse('node', 'test');
  }).toThrow();
});

describe('parse parameter is treated as readonly, per TypeScript declaration', () => {
  test('when parse called then parameter does not change', () => {
    const program = new commander.Command();
    program.argument('[args...]');
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    program.parse(param);
    expect(param).toEqual(original);
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
    expect(param).toEqual(original);
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
    expect(program.args).toEqual(oldArgs);
    expect(program.rawArgs).toEqual(oldRawArgs);
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
    expect(param).toEqual(original);
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
    expect(param).toEqual(original);
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
    expect(program.args).toEqual(oldArgs);
    expect(program.rawArgs).toEqual(oldRawArgs);
  });
});

describe('.parse() called multiple times', () => {
  test('when use boolean options then option values reset', () => {
    const program = new commander.Command().option('--black').option('--white');

    program.parse(['--black'], { from: 'user' });
    expect(program.opts()).toEqual({ black: true });

    program.parse(['--white'], { from: 'user' });
    expect(program.opts()).toEqual({ white: true });
  });

  test('when use options with option-argument then option values and sources reset', () => {
    const program = new commander.Command()
      .option('-f, --foo <value>')
      .option('-b, --bar <value>');

    program.parse(['--foo', 'FOO'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: 'FOO' });
    expect(program.getOptionValueSource('foo')).toEqual('cli');
    expect(program.getOptionValueSource('bar')).toBeUndefined();

    program.parse(['--bar', 'BAR'], { from: 'user' });
    expect(program.opts()).toEqual({ bar: 'BAR' });
    expect(program.getOptionValueSource('foo')).toBeUndefined();
    expect(program.getOptionValueSource('bar')).toEqual('cli');
  });

  test('when use options with option-argument and default then option values and sources reset', () => {
    const program = new commander.Command()
      .option('-f, --foo <value>', 'description', 'default-FOO')
      .option('-b, --bar <value>', 'description', 'default-BAR');

    program.parse(['--foo', 'FOO'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: 'FOO', bar: 'default-BAR' });
    expect(program.getOptionValueSource('foo')).toEqual('cli');
    expect(program.getOptionValueSource('bar')).toEqual('default');

    program.parse(['--bar', 'BAR'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: 'default-FOO', bar: 'BAR' });
    expect(program.getOptionValueSource('foo')).toEqual('default');
    expect(program.getOptionValueSource('bar')).toEqual('cli');
  });

  test('when use negated options then option values reset', () => {
    const program = new commander.Command()
      .option('--no-foo')
      .option('--no-bar');

    program.parse(['--no-foo'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: false, bar: true });

    program.parse(['--no-bar'], { from: 'user' });
    expect(program.opts()).toEqual({ foo: true, bar: false });
  });

  test('when use variadic option then option values reset', () => {
    const program = new commander.Command().option('--var <items...>');

    program.parse(['--var', 'a', 'b'], { from: 'user' });
    expect(program.opts()).toEqual({ var: ['a', 'b'] });

    program.parse(['--var', 'c'], { from: 'user' });
    expect(program.opts()).toEqual({ var: ['c'] });
  });

  test('when use collect example then option value resets', () => {
    function collect(value, previous) {
      return previous.concat([value]);
    }
    const program = new commander.Command();
    program.option('-c, --collect <value>', 'repeatable value', collect, []);

    program.parse(['-c', 'a', '-c', 'b'], { from: 'user' });
    expect(program.opts()).toEqual({ collect: ['a', 'b'] });

    program.parse(['-c', 'c'], { from: 'user' });
    expect(program.opts()).toEqual({ collect: ['c'] });
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
    expect(program.opts()).toEqual({ verbose: 3 });
    program.parse(['-vv'], { from: 'user' });

    expect(program.opts()).toEqual({ verbose: 2 });
    program.parse([], { from: 'user' });
    expect(program.opts()).toEqual({ verbose: 0 });
  });

  test('when use parse and parseAsync then option values reset', async () => {
    const program = new commander.Command().option('--black').option('--white');

    program.parse(['--black'], { from: 'user' });
    expect(program.opts()).toEqual({ black: true });
    await program.parseAsync(['--white'], { from: 'user' });
    expect(program.opts()).toEqual({ white: true });
  });

  test('when call subcommand then option values reset (program and subcommand)', () => {
    const program = new commander.Command().option('--black').option('--white');
    const subcommand = program.command('sub').option('--red').option('--green');

    program.parse(['--black', 'sub', '--red'], { from: 'user' });
    expect(subcommand.optsWithGlobals()).toEqual({ black: true, red: true });

    program.parse(['--white', 'sub', '--green'], { from: 'user' });
    expect(subcommand.optsWithGlobals()).toEqual({ white: true, green: true });
  });

  test('when call different subcommand then no reset because lazy', () => {
    // This is not a required behaviour, but is the intended behaviour.
    const program = new commander.Command();
    const sub1 = program.command('sub1').option('--red');
    const sub2 = program.command('sub2').option('--green');

    program.parse(['sub1', '--red'], { from: 'user' });
    expect(sub1.opts()).toEqual({ red: true });
    expect(sub2.opts()).toEqual({});

    program.parse(['sub2', '--green'], { from: 'user' });
    expect(sub1.opts()).toEqual({ red: true });
    expect(sub2.opts()).toEqual({ green: true });
  });

  test('when parse with different implied program name then name changes', () => {
    const program = new commander.Command();

    program.parse(['node', 'script1.js']);
    expect(program.name()).toEqual('script1');

    program.parse(['electron', 'script2.js']);
    expect(program.name()).toEqual('script2');
  });

  test('when parse with different arguments then args change', () => {
    // weak test, would work without store/reset!
    const program = new commander.Command()
      .argument('<first>')
      .argument('[second]');

    program.parse(['one', 'two'], { from: 'user' });
    expect(program.args).toEqual(['one', 'two']);

    program.parse(['alpha'], { from: 'user' });
    expect(program.args).toEqual(['alpha']);
  });

  test('when parse with different arguments then rawArgs change', () => {
    // weak test, would work without store/reset!
    const program = new commander.Command()
      .argument('<first>')
      .option('--white')
      .option('--black');

    program.parse(['--white', 'one'], { from: 'user' });
    expect(program.rawArgs).toEqual(['--white', 'one']);

    program.parse(['--black', 'two'], { from: 'user' });
    expect(program.rawArgs).toEqual(['--black', 'two']);
  });

  test('when parse with different arguments then processedArgs change', () => {
    // weak test, would work without store/reset!
    const program = new commander.Command().argument(
      '<first>',
      'first arg',
      parseFloat,
    );

    program.parse([123], { from: 'user' });
    expect(program.processedArgs).toEqual([123]);

    program.parse([456], { from: 'user' });
    expect(program.processedArgs).toEqual([456]);
  });

  test('when parse subcommand then reset state before preSubcommand hook called', () => {
    let hookCalled = false;
    const program = new commander.Command().hook(
      'preSubcommand',
      (thisCommand, subcommand) => {
        hookCalled = true;
        expect(subcommand.opts()).toEqual({});
      },
    );
    const subcommand = program.command('sub').option('--red').option('--green');

    hookCalled = false;
    program.parse(['sub', '--red'], { from: 'user' });
    expect(hookCalled).toBe(true);
    expect(subcommand.opts()).toEqual({ red: true });

    hookCalled = false;
    program.parse(['sub', '--green'], { from: 'user' });
    expect(hookCalled).toBe(true);
    expect(subcommand.opts()).toEqual({ green: true });
  });

  test('when using storeOptionsAsProperties then throw on second parse', () => {
    const program = new commander.Command().storeOptionsAsProperties();
    program.parse();
    expect(() => {
      program.parse();
    }).toThrow();
  });
});
