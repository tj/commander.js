const commander = require('../');

// Testing some Electron conventions but not directly using Electron to avoid overheads.
// https://github.com/electron/electron/issues/4690#issuecomment-217435222
// https://www.electronjs.org/docs/api/process#processdefaultapp-readonly

describe('.parse() args from', () => {
  test('when no args then use process.argv and app/script/args', () => {
    const program = new commander.Command();
    const hold = process.argv;
    process.argv = 'node script.js user'.split(' ');
    program.parse();
    process.argv = hold;
    expect(program.args).toEqual(['user']);
  });

  test('when no args and electron properties and not default app then use process.argv and app/args', () => {
    const program = new commander.Command();
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
    program.parse('node script.js user'.split(' '));
    expect(program.args).toEqual(['user']);
  });

  test('when args from "node" then app/script/args', () => {
    const program = new commander.Command();
    program.parse('node script.js user'.split(' '), { from: 'node' });
    expect(program.args).toEqual(['user']);
  });

  test('when args from "electron" and not default app then app/args', () => {
    const program = new commander.Command();
    const hold = process.defaultApp;
    process.defaultApp = undefined;
    program.parse('customApp user'.split(' '), { from: 'electron' });
    process.defaultApp = hold;
    expect(program.args).toEqual(['user']);
  });

  test('when args from "electron" and default app then app/script/args', () => {
    const program = new commander.Command();
    const hold = process.defaultApp;
    process.defaultApp = true;
    program.parse('electron script user'.split(' '), { from: 'electron' });
    process.defaultApp = hold;
    expect(program.args).toEqual(['user']);
  });

  test('when args from "user" then args', () => {
    const program = new commander.Command();
    program.parse('user'.split(' '), { from: 'user' });
    expect(program.args).toEqual(['user']);
  });

  test('when args from "silly" then throw', () => {
    const program = new commander.Command();
    expect(() => {
      program.parse(['node', 'script.js'], { from: 'silly' });
    }).toThrow();
  });
});

describe('return type', () => {
  test('when call .parse then returns program', () => {
    const program = new commander.Command();
    program
      .action(() => { });

    const result = program.parse(['node', 'test']);
    expect(result).toBe(program);
  });

  test('when await .parseAsync then returns program', async() => {
    const program = new commander.Command();
    program
      .action(() => { });

    const result = await program.parseAsync(['node', 'test']);
    expect(result).toBe(program);
  });

  test('when await .parseAsync and asynchronous custom processing for arguments fails then rejects', async() => {
    class MyError extends Error {}
    const errors = [new MyError(), new MyError()];
    const mockCoercions = errors.map(
      error => jest.fn().mockRejectedValue(error)
    );

    const program = new commander.Command();
    program
      .argument('[arg]', 'desc', mockCoercions[0])
      .argument('[arg]', 'desc', mockCoercions[1])
      .action(() => { });

    const result = program.parseAsync(['1', '2'], { from: 'user' });
    await expect(result).rejects.toBeInstanceOf(MyError);
    mockCoercions.forEach(fn => expect(fn).toHaveBeenCalledTimes(1));
  });

  test('when await .parseAsync and asynchronous custom processing for repeated non-variadic option always fails then rejects', async() => {
    class MyError extends Error {}
    const mockCoercion = jest.fn().mockImplementation(
      () => Promise.reject(new MyError())
    );

    const program = new commander.Command();
    program
      .option('-a [arg]', 'desc', mockCoercion)
      .action(() => { });

    const result = program.parseAsync(
      ['-a', '1', '-a', '2', '-a', '3'], { from: 'user' }
    );
    await expect(result).rejects.toBeInstanceOf(MyError);
    expect(mockCoercion).toHaveBeenCalledTimes(1);
  });
});

// Easy mistake to make when writing unit tests
test('when parse strings instead of array then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.parse('node', 'test');
  }).toThrow();
});

describe('parse parameter is treated as readonly, per TypeScript declaration', () => {
  test('when parse called then parameter does not change', () => {
    const program = new commander.Command();
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    program.parse(param);
    expect(param).toEqual(original);
  });

  test('when parse called and parsed args later changed then parameter does not change', () => {
    const program = new commander.Command();
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
  test('when parse called then parameter does not change', async() => {
    const program = new commander.Command();
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    await program.parseAsync(param);
    expect(param).toEqual(original);
  });

  test('when parseAsync called and parsed args later changed then parameter does not change', async() => {
    const program = new commander.Command();
    program.option('--debug');
    const original = ['node', '--debug', 'arg'];
    const param = original.slice();
    await program.parseAsync(param);
    program.args.length = 0;
    program.rawArgs.length = 0;
    expect(param).toEqual(original);
  });

  test('when parseAsync called and param later changed then parsed args do not change', async() => {
    const program = new commander.Command();
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
