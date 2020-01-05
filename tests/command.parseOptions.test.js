const commander = require('../');
const childProcess = require('child_process');
const path = require('path');

// Combination of parse and parseOptions tests which are are more about details
// than high level behaviours which are tested elsewhere.

// Tests created from reported bugs
describe('regression tests', () => {
  // https://github.com/tj/commander.js/issues/1039
  // https://github.com/tj/commander.js/issues/561
  test('when unknown option and multiple arguments then unknown option detected', () => {
    const program = new commander.Command();
    program
      .exitOverride();
    expect(() => {
      program.parse(['node', 'text', '--bug', '0', '1', '2', '3']);
    }).toThrow();
  });

  // https://github.com/tj/commander.js/issues/1032
  function createProgram1032() {
    const program = new commander.Command();
    program
      .command('doit [id]')
      .option('--better', 'do it better')
      .action((id, cmd) => {
      });
    return program;
  };

  // https://github.com/tj/commander.js/issues/1032
  test('when specify subcommand and argument then program.args not empty', () => {
    const program = createProgram1032();
    program.parse(['node', 'test.js', 'doit', 'myid']);
    expect(program.args.length).toBeGreaterThan(0);
  });

  // https://github.com/tj/commander.js/issues/1032
  test('when specify subcommand and option and argument then program.args not empty', () => {
    const program = createProgram1032();
    program.parse(['node', 'test.js', 'doit', '--better', 'myid']);
    expect(program.args.length).toBeGreaterThan(0);
  });

  // https://github.com/tj/commander.js/issues/508
  test('when arguments to executable include option flags then argument order preserved', (done) => {
    const pm = path.join(__dirname, 'fixtures/pm');
    childProcess.execFile('node', [pm, 'echo', '1', '2', '--dry-run', '3', '4', '5', '6'], function(_error, stdout, stderr) {
      expect(stdout).toBe("[ '1', '2', '--dry-run', '3', '4', '5', '6' ]\n");
      done();
    });
  });
});
