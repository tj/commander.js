const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('subcommandDescription', () => {
  test('when program has no description then empty string', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.subcommandDescription(program)).toEqual('');
  });

  test('when program has description then return description', () => {
    const description = 'description';
    const program = new commander.Command();
    program.description(description);
    const helper = new commander.Help();
    expect(helper.subcommandDescription(program)).toEqual(description);
  });
});
