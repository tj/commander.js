const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('columns', () => {
  test('when default then columns from stdout', () => {
    const hold = process.stdout.columns;
    process.stdout.columns = 123;
    const program = new commander.Command();
    const helper = program.createHelp();
    expect(helper.columns).toEqual(123);
    process.stdout.columns = hold;
  });

  test('when configure columns then value from user', () => {
    const program = new commander.Command();
    program.configureHelp({ columns: 321 });
    const helper = program.createHelp();
    expect(helper.columns).toEqual(321);
  });
});
