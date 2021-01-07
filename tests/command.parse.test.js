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
});

// Easy mistake to make when writing unit tests
test('when parse strings instead of array then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.parse('node', 'test');
  }).toThrow();
});
