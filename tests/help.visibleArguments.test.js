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

  test('when argument and legacy argument description then returned', () => {
    const program = new commander.Command();
    program.argument('<file>');
    program.description('', {
      file: 'file description'
    });
    const helper = new commander.Help();
    const visibleArguments = helper.visibleArguments(program);
    expect(visibleArguments.length).toEqual(1);
    expect(visibleArguments[0]).toEqual(new commander.Argument('<file>', 'file description'));
  });

  test('when arguments and some described then all returned', () => {
    const program = new commander.Command();
    program.argument('<file1>', 'file1 description');
    program.argument('<file2>');
    const helper = new commander.Help();
    const visibleArguments = helper.visibleArguments(program);
    expect(visibleArguments.length).toEqual(2);
    expect(visibleArguments[0]).toEqual(new commander.Argument('<file1>', 'file1 description'));
    expect(visibleArguments[1]).toEqual(new commander.Argument('<file2>'));
  });

  test('when arguments and some legacy described then all returned', () => {
    const program = new commander.Command();
    program.argument('<file1>');
    program.argument('<file2>');
    program.description('', {
      file1: 'file1 description'
    });
    const helper = new commander.Help();
    const visibleArguments = helper.visibleArguments(program);
    expect(visibleArguments.length).toEqual(2);
    expect(visibleArguments[0]).toEqual(new commander.Argument('<file1>', 'file1 description'));
    expect(visibleArguments[1]).toEqual(new commander.Argument('<file2>'));
  });
});
