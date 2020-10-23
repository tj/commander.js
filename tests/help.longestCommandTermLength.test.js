const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('longestSubcommandTermLength', () => {
  test('when no commands then returns zero', () => {
    const program = new commander.Command();
    const helper = new commander.Help();
    expect(helper.longestSubcommandTermLength(program, helper)).toEqual(0);
  });

  test('when command and no help then returns length of term', () => {
    const sub = new commander.Command('sub');
    const program = new commander.Command();
    program
      .addHelpCommand(false)
      .addCommand(sub);
    const helper = new commander.Help();
    expect(helper.longestSubcommandTermLength(program, helper)).toEqual(helper.subcommandTerm(sub).length);
  });

  test('when command with arg and no help then returns length of term', () => {
    const sub = new commander.Command('sub <file)');
    const program = new commander.Command();
    program
      .addHelpCommand(false)
      .addCommand(sub);
    const helper = new commander.Help();
    expect(helper.longestSubcommandTermLength(program, helper)).toEqual(helper.subcommandTerm(sub).length);
  });

  test('when multiple commands then returns longest length', () => {
    const longestCommandName = 'alphabet-soup <longer_than_help>';
    const program = new commander.Command();
    program
      .addHelpCommand(false)
      .command('before', 'desc')
      .command(longestCommandName, 'desc')
      .command('after', 'desc');
    const helper = new commander.Help();
    expect(helper.longestSubcommandTermLength(program, helper)).toEqual(longestCommandName.length);
  });

  test('when just help command then returns length of help term', () => {
    const program = new commander.Command();
    program
      .addHelpCommand(true);
    const helper = new commander.Help();
    expect(helper.longestSubcommandTermLength(program, helper)).toEqual('help [command]'.length);
  });
});
