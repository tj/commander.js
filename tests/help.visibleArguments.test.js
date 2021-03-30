const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('visibleArguments', () => {
  test('when no arguments then empty array', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.visibleArguments(program)).toEqual([]);
  });

  test('when argument but no argument description then empty array', () => {
    const program = new commander.Command();
    program.argument('<file>');
    const helper = new commander.Help();
    expect(helper.visibleArguments(program)).toEqual([]);
  });

  test('when argument and argument description then returned', () => {
    const program = new commander.Command();
    program.argument('<file>', 'file description');
    const helper = new commander.Help();
    const visibleArguments = helper.visibleArguments(program);
    expect(visibleArguments.length).toEqual(1);
    expect(visibleArguments[0]).toEqual(new commander.Argument('<file>', 'file description'));
  });
});
