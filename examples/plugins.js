#!/usr/bin/env node

const { Command } = require('commander');

new Command()
  .option('-c, --compress')
  .command('sub-command')
  .register(prettyErrors)
  .register(setMeta)
  .register(logger)
  .action(() => {
    // noop
  })
  .parse();

function prettyErrors(command) {
  function errorColor(str) {
    // Add ANSI escape codes to display text in red.
    return `\x1b[31m${str}\x1b[0m`;
  }

  command.configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Highlight errors in color.
    outputError: (str, write) => write(errorColor(str)),
  });
}

function setMeta(command) {
  command.version('1.2.3');
}

function logger(command) {
  command.option('--trace');
  command.hook('preAction', (thisCommand, actionCommand) => {
    if (thisCommand.opts().trace) {
      console.log(
        `About to call action handler for subcommand: ${actionCommand.name()}`,
      );
      console.log('arguments: %O', actionCommand.args);
      console.log('options: %o', actionCommand.opts());
    }
  });
}

// Try the following:
//    node plugins.js --version
//    node plugins.js --unknown
//    node plugins.js --help
//    node plugins.js --trace
//    node plugins.js
