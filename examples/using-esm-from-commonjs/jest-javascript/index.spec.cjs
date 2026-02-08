const { Command } = require('commander');
const { test, expect } = require('@jest/globals');

test('when set command name then get command name', () => {
  const program = new Command();
  const name = 'my-cli';
  program.name(name);
  expect(program.name()).toBe(name);
});
