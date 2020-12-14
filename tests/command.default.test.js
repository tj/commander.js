const childProcess = require('child_process');
const commander = require('../');
const path = require('path');
const util = require('util');

const execFileAsync = util.promisify(childProcess.execFile);

describe('default executable command', () => {
  // Calling node explicitly so pm works without file suffix cross-platform.
  const pm = path.join(__dirname, './fixtures/pm');

  test('when default subcommand and no command then call default', async() => {
    const { stdout } = await execFileAsync('node', [pm]);
    expect(stdout).toBe('default\n');
  });

  test('when default subcommand and unrecognised argument then call default with argument', async() => {
    const { stdout } = await execFileAsync('node', [pm, 'an-argument']);
    expect(stdout).toBe("default\n[ 'an-argument' ]\n");
  });

  test('when default subcommand and unrecognised option then call default with option', async() => {
    const { stdout } = await execFileAsync('node', [pm, '--an-option']);
    expect(stdout).toBe("default\n[ '--an-option' ]\n");
  });
});

describe('default action command', () => {
  function makeProgram() {
    const program = new commander.Command();
    const actionMock = jest.fn();
    program
      .command('other');
    program
      .command('default', { isDefault: true })
      .allowUnknownOption()
      .allowExcessArguments()
      .action(actionMock);
    return { program, actionMock };
  }

  test('when default subcommand and no command then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });

  test('when default subcommand and unrecognised argument then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js an-argument'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });

  test('when default subcommand and unrecognised option then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js --an-option'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });
});

describe('default added command', () => {
  function makeProgram() {
    const actionMock = jest.fn();
    const defaultCmd = new commander.Command('default')
      .allowUnknownOption()
      .allowExcessArguments()
      .action(actionMock);

    const program = new commander.Command();
    program
      .command('other');
    program
      .addCommand(defaultCmd, { isDefault: true });
    return { program, actionMock };
  }

  test('when default subcommand and no command then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });

  test('when default subcommand and unrecognised argument then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js an-argument'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });

  test('when default subcommand and unrecognised option then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js --an-option'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });
});
