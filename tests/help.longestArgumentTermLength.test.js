const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('longestArgumentTermLength', () => {
  test('when no arguments then returns zero', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.longestArgumentTermLength(program, helper)).toEqual(0);
  });

  test('when has argument description then returns argument length', () => {
    const program = new commander.Command();
    program.argument('<wonder>', 'wonder description');
    const helper = new commander.Help();
    expect(helper.longestArgumentTermLength(program, helper)).toEqual('wonder'.length);
  });

  test('when has multiple argument descriptions then returns longest', () => {
    const program = new commander.Command();
    program.argument('<alpha>', 'x');
    program.argument('<longest>', 'x');
    program.argument('<beta>', 'x');
    const helper = new commander.Help();
    expect(helper.longestArgumentTermLength(program, helper)).toEqual('longest'.length);
  });
});
