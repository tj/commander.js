const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('commandUsage', () => {
  test('when single program then "Usage: program [options]"', () => {
    const program = new commander.Command();
    program.name('program');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program [options]');
  });

  test('when multi program then "Usage: program [options] [command]"', () => {
    const program = new commander.Command();
    program.name('program');
    program.command('sub');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program [options] [command]');
  });

  test('when program has alias then usage includes alias', () => {
    const program = new commander.Command();
    program
      .name('program')
      .alias('alias');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program|alias [options]');
  });

  test('when help for subcommand then usage includes hierarchy', () => {
    const program = new commander.Command();
    program
      .name('program');
    const sub = program.command('sub')
      .name('sub');
    const helper = new commander.Help();
    expect(helper.commandUsage(sub)).toEqual('Usage: program sub [options]');
  });

  test('when program has argument then usage includes argument', () => {
    const program = new commander.Command();
    program
      .name('program')
      .arguments('<file>');
    const helper = new commander.Help();
    expect(helper.commandUsage(program)).toEqual('Usage: program [options] <file>');
  });
});
