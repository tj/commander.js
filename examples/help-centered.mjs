import { Command, Help } from 'commander';

// Right-justify the terms in the help output.
// Setup a subclass so we can do simple tweak of formatItem.

class MyHelp extends Help {
  formatItem(term, termWidth, description, helper) {
    // Pre-pad the term at start instead of end.
    const paddedTerm = term.padStart(
      termWidth + term.length - helper.displayWidth(term),
    );

    return super.formatItem(paddedTerm, termWidth, description, helper);
  }
}

class MyCommand extends Command {
  createCommand(name) {
    return new MyCommand(name);
  }
  createHelp() {
    return Object.assign(new MyHelp(), this.configureHelp());
  }
}

const program = new MyCommand();

program.configureHelp({ MyCommand });

program
  .option('-s', 'short flag')
  .option('-f, --flag', 'short and long flag')
  .option('--long <number>', 'long flag');

program.command('compile').alias('c').description('compile something');

program.command('run', 'run something').command('print', 'print something');

program.parse();

// Try the following:
//    node help-centered.mjs --help
