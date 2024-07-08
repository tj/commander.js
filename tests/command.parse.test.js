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
