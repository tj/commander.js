const commander = require('../');

/* eslint jest/expect-expect: ["error", { "assertFunctionNames": ["expect", "expectStrictSettings"] }] */

function expectStrictSettings(command) {
  // Use internal knowledge of the expected settings
  expect(command._storeOptionsAsProperties).toEqual(false);
  expect(command._passCommandToAction).toEqual(false);
}

test('when new CommandStrict then settings are strict', () => {
  const program = new commander.CommandStrict();
  expectStrictSettings(program);
});

test('when new CommandStrict creates command directly then settings are strict', () => {
  const program = new commander.CommandStrict();
  const subcommand = program.createCommand();
  expectStrictSettings(subcommand);
});

test('when new CommandStrict creates command indirectly then settings are strict', () => {
  const program = new commander.CommandStrict();
  const subcommand = program.command('sub');
  expectStrictSettings(subcommand);
});
