const commander = require('../');

// Testing some Electron conventions but not directly using Electron to avoid overheads.
// https://github.com/electron/electron/issues/4690#issuecomment-217435222
// https://www.electronjs.org/docs/api/process#processdefaultapp-readonly

describe('.parse() user args', () => {
  test('when no args then use process.argv and app/script/args', () => {
    const program = new commander.Command();
    const hold = process.argv;
    process.argv = 'node script.js user'.split(' ');
    program.parse();
    process.argv = hold;
    expect(program.args).toEqual(['user']);
  });

  // implicit also supports detecting electron but more implementation knowledge required than useful to test

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
