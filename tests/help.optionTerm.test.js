const commander = require('../');

// These are tests of the Help class, not of the Command help.
// There is some overlap with the higher level Command tests (which predate Help).

describe('optionTerm', () => {
  test('when -s flags then returns flags', () => {
    const flags = '-s';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  test('when --short flags then returns flags', () => {
    const flags = '--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  test('when -s,--short flags then returns flags', () => {
    const flags = '-s,--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });

  test('when -s|--short flags then returns flags', () => {
    const flags = '-s|--short';
    const option = new commander.Option(flags);
    const helper = new commander.Help();
    expect(helper.optionTerm(option)).toEqual(flags);
  });
});
