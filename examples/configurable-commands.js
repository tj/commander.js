#!/usr/bin/env node

import { fileURLToPath } from 'node:url';
import { Command } from 'commander';

function createCommandCatalog(output) {
  return [
    () =>
      new Command('inspect')
        .alias('i')
        .description('Inspect a project')
        .action(() => output('inspect')),
    () =>
      new Command('data')
        .alias('d')
        .description('Work with data')
        .action(() => output('data')),
    () => {
      const command = new Command('trace')
        .alias('tr')
        .description('Trace execution')
        .action(() => output('trace'));
      command
        .command('span')
        .description('Trace a span')
        .action(() => output('trace span'));
      return command;
    },
    () => {
      const command = new Command('chat')
        .alias('c')
        .description('Start an interactive chat')
        .action(() => output('chat'));
      command
        .command('send')
        .description('Send a chat message')
        .action(() => output('chat send'));
      return command;
    },
    () =>
      new Command('perf')
        .alias('p')
        .description('Show performance information')
        .action(() => output('perf')),
  ];
}

export function createProgram(
  selectedCommands = new Set(['inspect', 'data', 'trace']),
  output = console.log,
) {
  const program = new Command()
    .name('configurable')
    .description('CLI with a configurable command set')
    .showSuggestionAfterError();

  for (const createCommand of createCommandCatalog(output)) {
    const command = createCommand();
    if (selectedCommands.has(command.name())) {
      program.addCommand(command);
    }
  }

  return program;
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const selectedCommands = new Set(
    (process.env.COMMANDS ?? 'inspect,data,trace')
      .split(',')
      .map((name) => name.trim())
      .filter(Boolean),
  );
  createProgram(selectedCommands).parse(process.argv);
}
