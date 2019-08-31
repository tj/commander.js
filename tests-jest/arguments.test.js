// Example test, fairly direct port from original

/**
 * Top-level command syntax.
 */

const commander = require('../');

function makeProgram() {
  const program = new commander.Command();
  const programActionHandler = jest.fn();
  program
    .version('0.0.1')
    .arguments('<cmd> [env]')
    .action(programActionHandler)
    .option('-C, --chdir <path>', 'change the working directory')
    .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
    .option('-T, --no-tests', 'ignore test hook');
  return { program, programActionHandler };
}

test('option without arguments', () => {
  const { program, programActionHandler } = makeProgram();
  program.parse(['node', 'test', '--config', 'conf']);
  expect(program.config).toBe('conf');
  // Historically allowed to call program without the required argument [sic]
  expect(programActionHandler).toHaveBeenCalledTimes(0);
});

test('options mixed into arguments', () => {
  const { program, programActionHandler } = makeProgram();
  program.parse(['node', 'test', '--config', 'conf2', 'setup', '--setup_mode', 'mode3', 'env1']);
  expect(program.config).toBe('conf2');
  expect(programActionHandler).toHaveBeenCalledTimes(1);
  expect(programActionHandler).toHaveBeenCalledWith('setup', 'env1', expect.anything());
});
