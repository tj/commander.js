const childProcess = require('child_process');
const commander = require('../');
const path = require('path');
const util = require('util');

const execAsync = util.promisify(childProcess.exec);

describe('default executable command', () => {
  // Calling node explicitly so pm works without file suffix cross-platform.
  const pm = path.join(__dirname, './fixtures/pm');

  test('when default subcommand and no command then call default', async() => {
    const { stdout } = await execAsync(`node ${pm}`);
    expect(stdout).toBe('default\n');
  });

  test('when default subcommand and unrecognised argument then call default with argument', async() => {
    const { stdout } = await execAsync(`node ${pm} an-argument`);
    expect(stdout).toBe("default\n[ 'an-argument' ]\n");
  });

  test('when default subcommand and unrecognised option then call default with option', async() => {
    const { stdout } = await execAsync(`node ${pm} --an-option`);
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
      .action(actionMock);
    return { program, actionMock };
  }

  test('when default subcommand and no command then call default', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });

  test('when default subcommand and unrecognised argument then call default with argument', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js an-argument'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });

  test('when default subcommand and unrecognised option then call default with option', () => {
    const { program, actionMock } = makeProgram();
    program.parse('node test.js --an-option'.split(' '));
    expect(actionMock).toHaveBeenCalled();
  });
});
