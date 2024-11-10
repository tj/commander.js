const childProcess = require('child_process');
const commander = require('../');
const path = require('path');
const util = require('util');

const execFileAsync = util.promisify(childProcess.execFile);

// Combination of parse and parseOptions tests which are more about details
// than high level behaviours which are tested elsewhere.

// Tests created from reported bugs
describe('regression tests', () => {
  // https://github.com/tj/commander.js/issues/1032
  function createProgram1032() {
    const program = new commander.Command();
    program
      .command('doit [id]')
      .option('--better', 'do it better')
      .action((id, cmd) => {});
    return program;
  }

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
  test('when arguments to executable include option flags then argument order preserved', async () => {
    const pm = path.join(__dirname, 'fixtures/pm');
    const { stdout } = await execFileAsync('node', [
      pm,
      'echo',
      '1',
      '2',
      '--dry-run',
      '3',
      '4',
      '5',
      '6',
    ]);
    expect(stdout).toBe("[ '1', '2', '--dry-run', '3', '4', '5', '6' ]\n");
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
    program.action(() => {});
    return program;
  }

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
    expect(result).toEqual({
      operands: [],
      unknown: ['--unknown1', '--', '--unknown2'],
    });
  });
});

// parse now sets program.args to the result of parseOptions (operands + unknown). Some limited testing.
describe('parse and program.args', () => {
  test('when program has known flag and operand then option removed and operand returned', () => {
    const program = new commander.Command();
    program.option('--global-flag').argument('[arg...]');
    program.parse('node test.js --global-flag arg'.split(' '));
    expect(program.args).toEqual(['arg']);
  });

  test('when program has mixed arguments then known options removed and rest returned in same order', () => {
    const program = new commander.Command();
    program
      .allowUnknownOption()
      .option('--global-flag')
      .option('--global-value <value>')
      .argument('[arg...]');
    program.parse(
      'node test.js aaa --global-flag bbb --unknown ccc --global-value value'.split(
        ' ',
      ),
    );
    expect(program.args).toEqual(['aaa', 'bbb', '--unknown', 'ccc']);
  });

  test('when subcommand has mixed arguments then program flags removed and rest returned in same order', () => {
    const program = new commander.Command();
    program
      .option('--global-flag')
      .option('--global-value <value>')
      .command('sub [args...]')
      .option('--sub-flag');
    program.parse(
      'node test.js --global-flag sub --sub-flag arg --global-value value'.split(
        ' ',
      ),
    );
    expect(program.args).toEqual(['sub', '--sub-flag', 'arg']);
  });
});

// Utility Conventions: https://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_01
//
// 12.1 Utility Argument Syntax
// 2. Option-arguments are shown separated from their options by <blank> characters, except when the option-argument is
// enclosed in the '[' and ']' notation to indicate that it is optional. This reflects the situation in which an
// optional option-argument (if present) is included within the same argument string as the option; for a mandatory option-argument,
// it is the next argument. The Utility Syntax Guidelines in Utility Syntax Guidelines require that the option be a separate argument
// from its option-argument and that option-arguments not be optional, but there are some exceptions in POSIX.1-2017 to ensure
// continued operation of historical applications:
//
// a. If the SYNOPSIS of a standard utility shows an option with a mandatory option-argument (as with [ -c option_argument] in the example),
//    a conforming application shall use separate arguments for that option and its option-argument. However, a conforming implementation shall
//    also permit applications to specify the option and option-argument in the same argument string without intervening <blank> characters.
//
// b. If the SYNOPSIS shows an optional option-argument (as with [ -f[ option_argument]] in the example), a conforming application
//    shall place any option-argument for that option directly adjacent to the option in the same argument string, without intervening
//    <blank> characters. If the utility receives an argument containing only the option, it shall behave as specified in its description
//    for an omitted option-argument; it shall not treat the next argument (if any) as the option-argument for that option.
//
// 12.2 Utility Syntax Guidelines, Guideline 5:
// One or more options without option-arguments, followed by at most one option that takes an option-argument, should be accepted when
// grouped behind one '-' delimiter.

// Commander conformance:
// - allows separate argument for required option-argument
// - allows value in same argument for short flag with required option-argument
// - non-conforming: allows separate argument for optional option-argument if it does not start with '-'
// - allows value in same argument for short flag with optional option-argument
// - allows short flags as per 12.2
//
// The focus in this file is testing the behaviours with known vs unknown options.
// See options.values.test.js for more general testing of known options.

describe('Utility Conventions', () => {
  function createProgram() {
    const program = new commander.Command();
    program
      .option('-a,--aaa')
      .option('-b,--bbb')
      .option('-c,--ccc <value>')
      .option('-d,--ddd [value]');
    program.action(() => {});
    return program;
  }

  test('when program has combo known boolean short flags then arg removed', () => {
    const program = createProgram();
    const result = program.parseOptions(['-ab']);
    expect(result).toEqual({ operands: [], unknown: [] });
    expect(program.opts()).toEqual({ aaa: true, bbb: true });
  });

  test('when program has combo unknown short flags then arg preserved', () => {
    const program = createProgram();
    const result = program.parseOptions(['-pq']);
    expect(result).toEqual({ operands: [], unknown: ['-pq'] });
    expect(program.opts()).toEqual({});
  });

  test('when program has combo known short option and required value then arg removed', () => {
    const program = createProgram();
    const result = program.parseOptions(['-cvalue']);
    expect(result).toEqual({ operands: [], unknown: [] });
    expect(program.opts()).toEqual({ ccc: 'value' });
  });

  test('when program has combo known short option and optional value then arg removed', () => {
    const program = createProgram();
    const result = program.parseOptions(['-dvalue']);
    expect(result).toEqual({ operands: [], unknown: [] });
    expect(program.opts()).toEqual({ ddd: 'value' });
  });

  test('when program has known combo short boolean flags and required value then arg removed', () => {
    const program = createProgram();
    const result = program.parseOptions(['-abcvalue']);
    expect(result).toEqual({ operands: [], unknown: [] });
    expect(program.opts()).toEqual({ aaa: true, bbb: true, ccc: 'value' });
  });

  test('when program has known combo short boolean flags and optional value then arg removed', () => {
    const program = createProgram();
    const result = program.parseOptions(['-abdvalue']);
    expect(result).toEqual({ operands: [], unknown: [] });
    expect(program.opts()).toEqual({ aaa: true, bbb: true, ddd: 'value' });
  });

  test('when program has known long flag=value then arg removed', () => {
    const program = createProgram();
    const result = program.parseOptions(['--ccc=value']);
    expect(result).toEqual({ operands: [], unknown: [] });
    expect(program.opts()).toEqual({ ccc: 'value' });
  });

  test('when program has unknown long flag=value then arg preserved', () => {
    const program = createProgram();
    const result = program.parseOptions(['--rrr=value']);
    expect(result).toEqual({ operands: [], unknown: ['--rrr=value'] });
    expect(program.opts()).toEqual({});
  });

  test('when program has combo optional and combineFlagAndOptionalValue() then treat as value', () => {
    const program = createProgram();
    program.combineFlagAndOptionalValue();
    program.parseOptions(['-db']);
    expect(program.opts()).toEqual({ ddd: 'b' });
  });

  test('when program has combo optional and combineFlagAndOptionalValue(true) then treat as value', () => {
    const program = createProgram();
    program.combineFlagAndOptionalValue(true);
    program.parseOptions(['-db']);
    expect(program.opts()).toEqual({ ddd: 'b' });
  });

  test('when program has combo optional and combineFlagAndOptionalValue(false) then treat as boolean', () => {
    const program = createProgram();
    program.combineFlagAndOptionalValue(false);
    program.parseOptions(['-db']);
    expect(program.opts()).toEqual({ ddd: true, bbb: true });
  });
});
