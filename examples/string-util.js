const { Command } = require('commander');
const program = new Command();

// This is used as an example in the README for the Quick Start.

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program
  .command('split')
  .description('Split a string into substrings and display as an array.')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program
  .command('join')
  .description('Join the command-arguments into a single string')
  .argument('<strings...>', 'one or more strings')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((strings, options) => {
    console.log(strings.join(options.separator));
  });

program.parse();

// Try the following:
//    node string-util
//    node string-util help split
//    node string-util split --separator=/ a/b/c
//    node string-util split --first a,b,c
//    node string-util join a b c d
