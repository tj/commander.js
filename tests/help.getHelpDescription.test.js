const { Command } = require('../');
const { getHelpDescription } = require('../lib/help.js');

// Test of internal routine

test('when pass cmd.t without translations then returns default string', () => {
  const cmd = new Command();
  expect(getHelpDescription(cmd.t)).toEqual('display help for command');
});

test('when pass cmd.t with translation then returns translated string', () => {
  const cmd = new Command()
    .configureStrings({ 'display help for command': 'see all the help' });
  expect(getHelpDescription(cmd.t)).toEqual('see all the help');
});

test('when pass undefined then returns default string', () => {
  expect(getHelpDescription(undefined)).toEqual('display help for command');
});
