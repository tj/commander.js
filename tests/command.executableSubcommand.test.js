const { createTestCommand } = require('./testHelpers');
const { test } = require('node:test');
const assert = require('node:assert/strict');

// Executable subcommand tests that didn't fit in elsewhere.

// This is the default behaviour when no default command and no action handlers
test('when no command specified and executable subcommand then display help', (t) => {
  const program = createTestCommand();
  program.command('install', 'install description');
  assert.throws(
    () => {
      program.parse(['node', 'test']);
    },
    {
      code: 'commander.help',
    },
  );
});
