// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo

// Show use of .optsWithGlobals(), and compare with .opts().

const program = new Command();

program
  .option('-g, --global');

program
  .command('sub')
  .option('-l, --local')
  .action((options, cmd) => {
    console.log({
      opts: cmd.opts(),
      optsWithGlobals: cmd.optsWithGlobals()
    });
  });

program.parse();

// Try the following:
//    node optsWithGlobals.js --global sub --local
