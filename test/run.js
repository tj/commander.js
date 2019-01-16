#!/usr/bin/env node

const { spawnSync } = require('child_process')
const { readdirSync } = require('fs')
const { extname, join } = require('path')

process.env.NODE_ENV = 'test';

process.stdout.write('\n')
readdirSync(__dirname).forEach((file) => {
  if (!file.startsWith('test.') || file.includes('test.command.executableSubcommand.js') || file.includes('test.command.executableSubcommand.signals.hup.js')  || file.includes('test.command.executableSubcommand.signals.term.js') || file.includes('test.command.executableSubcommand.signals.usr1.js') || file.includes('test.command.executableSubcommand.signals.usr2.js') || file.includes('test.command.executableSubcommand.tsnode.js') || file.includes('test.command.executableSubcommandAlias.help.js') || file.includes('test.command.executableSubcommandAlias.js') || file.includes('test.command.executableSubcommandDefault.js') || file.includes('test.command.executableSubcommandSubCommand.js') || extname(file) !== '.js')
    return;
  process.stdout.write(`\x1b[90m   ${file}\x1b[0m `);
  const result = spawnSync(process.argv0, [ join('test', file) ]);
  if (result.status === 0) {
    process.stdout.write('\x1b[36m✓\x1b[0m\n');
  } else {
    process.stdout.write('\x1b[31m✖\x1b[0m\n');
    console.error(result.stderr.toString('utf8'));
    process.exit(result.status);
  }
})
