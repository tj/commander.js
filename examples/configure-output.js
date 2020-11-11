// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

const program = new commander.Command();

function red(str) {
  return `\x1b[31m${str}\x1b[0m`;
}

program
  .configureOutput({
    // Visibly override write routines for example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Output errors in red.
    outputError: (str, write) => write(red(str))
  });

program
  .version('1.2.3')
  .option('-c, --compress')
  .command('sub-command');

program.parse();

// Try the following:
//  node configure-output.js --version
//  node configure-output.js --unknown
//  node configure-output.js --help
//  node configure-output.js
