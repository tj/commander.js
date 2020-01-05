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

describe('parseOptions', () => {
  function createProgram() {
    const program = new commander.Command();
    program
      .option('--global-flag')
      .option('--global-value <value>')
      .command('sub [args...]')
      .option('--sub-flag');
    program
      .action(() => { });
    return program;
  };

  // Subcommands are just another potential operand as far as parseOptions is concerned, so limited testing of subcommand as such.

  test('when empty args then empty results', () => {
    const program = createProgram();
    const result = program.parseOptions([]);
    expect(result).toEqual({ operands: [], unknown: [] });
  });

  test('when only operands then results has all operands', () => {
    const program = createProgram();
    const result = program.parseOptions('one two three'.split(' '));
    expect(result).toEqual({ operands: ['one', 'two', 'three'], unknown: [] });
  });

  test('when subcommand and operand then results has subcommand and operand', () => {
    const program = createProgram();
    const result = program.parseOptions('sub one'.split(' '));
    expect(result).toEqual({ operands: ['sub', 'one'], unknown: [] });
  });

  test('when program has flag then option removed', () => {
    const program = createProgram();
    const result = program.parseOptions('--global-flag'.split(' '));
    expect(result).toEqual({ operands: [], unknown: [] });
  });

  test('when program has option with value then option removed', () => {
    const program = createProgram();
    const result = program.parseOptions('--global-value foo'.split(' '));
    expect(result).toEqual({ operands: [], unknown: [] });
  });

  test('when program has flag before operand then option removed', () => {
    const program = createProgram();
    const result = program.parseOptions('--global-flag arg'.split(' '));
    expect(result).toEqual({ operands: ['arg'], unknown: [] });
  });

  test('when program has flag after operand then option removed', () => {
    const program = createProgram();
    const result = program.parseOptions('arg --global-flag'.split(' '));
    expect(result).toEqual({ operands: ['arg'], unknown: [] });
  });

  test('when program has flag after subcommand then option removed', () => {
    const program = createProgram();
    const result = program.parseOptions('sub --global-flag'.split(' '));
    expect(result).toEqual({ operands: ['sub'], unknown: [] });
  });

  test('when program has unknown option then option returned in unknown', () => {
    const program = createProgram();
    const result = program.parseOptions('--unknown'.split(' '));
    expect(result).toEqual({ operands: [], unknown: ['--unknown'] });
  });

  test('when program has unknown option before operands then all unknown in same order', () => {
    const program = createProgram();
    const result = program.parseOptions('--unknown arg'.split(' '));
    expect(result).toEqual({ operands: [], unknown: ['--unknown', 'arg'] });
  });

  test('when program has unknown option after operand then option returned in unknown', () => {
    const program = createProgram();
    const result = program.parseOptions('arg --unknown'.split(' '));
    expect(result).toEqual({ operands: ['arg'], unknown: ['--unknown'] });
  });

  test('when program has flag after unknown option then flag removed', () => {
    const program = createProgram();
    const result = program.parseOptions('--unknown --global-flag'.split(' '));
    expect(result).toEqual({ operands: [], unknown: ['--unknown'] });
  });

  test('when subcommand has flag then flag returned as unknown', () => {
    const program = createProgram();
    const result = program.parseOptions('sub --sub-flag'.split(' '));
    expect(result).toEqual({ operands: ['sub'], unknown: ['--sub-flag'] });
  });

  test('when program has literal before known flag then option returned as operand', () => {
    const program = createProgram();
    const result = program.parseOptions('-- --global-flag'.split(' '));
    expect(result).toEqual({ operands: ['--global-flag'], unknown: [] });
  });

  test('when program has literal before unknown option then option returned as operand', () => {
    const program = createProgram();
    const result = program.parseOptions('-- --unknown uuu'.split(' '));
    expect(result).toEqual({ operands: ['--unknown', 'uuu'], unknown: [] });
  });

  test('when program has literal after unknown option then literal preserved too', () => {
    const program = createProgram();
    const result = program.parseOptions('--unknown1 -- --unknown2'.split(' '));
    expect(result).toEqual({ operands: [], unknown: ['--unknown1', '--', '--unknown2'] });
  });
});

// parse now sets program.args to the result of parseOptions (operands + unknown). Some limited testing.
describe('parse and program.args', () => {
  test('when program has known flag and operand then option removed and operand returned', () => {
    const program = new commander.Command();
    program
      .option('--global-flag');
    program.parse('node test.js --global-flag arg'.split(' '));
    expect(program.args).toEqual(['arg']);
  });

  test('when program has mixed arguments then known options removed and rest returned in same order', () => {
    const program = new commander.Command();
    program
      .allowUnknownOption()
      .option('--global-flag')
      .option('--global-value <value>');
    program.parse('node test.js aaa --global-flag bbb --unknown ccc --global-value value'.split(' '));
    expect(program.args).toEqual(['aaa', 'bbb', '--unknown', 'ccc']);
  });

  test('when subcommand has mixed arguments then program flags removed and rest returned in same order', () => {
    const program = new commander.Command();
    program
      .option('--global-flag')
      .option('--global-value <value>')
      .command('sub [args...]')
      .option('--sub-flag');
    program.parse('node test.js --global-flag sub --sub-flag arg --global-value value'.split(' '));
    expect(program.args).toEqual(['sub', '--sub-flag', 'arg']);
  });
});
