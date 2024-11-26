import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import {
  default as chalkStdOut,
  chalkStderr as chalkStdErr,
  supportsColor as supportsColorStdout,
  supportsColorStderr,
} from 'chalk';
import { Command, Help } from 'commander';

// Replace default color and wrapping support with Chalk packages as an example of
// a deep replacement of layout and style support.

// This example requires chalk and wrap-ansi and strip-ansi, and won't run
// from a clone of Commander repo without installing them first.
//
// For example using npm:
//    npm install chalk wrap-ansi strip-ansi

class MyHelp extends Help {
  constructor() {
    super();
    this.chalk = chalkStdOut;
  }

  prepareContext(contextOptions) {
    super.prepareContext(contextOptions);
    if (contextOptions?.error) {
      this.chalk = chalkStdErr;
    }
  }

  displayWidth(str) {
    return stripAnsi(str).length; // use imported package
  }

  boxWrap(str, width) {
    return wrapAnsi(str, width, { hard: true }); // use imported package
  }

  styleTitle(str) {
    return this.chalk.bold(str);
  }
  styleCommandText(str) {
    return this.chalk.cyan(str);
  }
  styleCommandDescription(str) {
    return this.chalk.magenta(str);
  }
  styleDescriptionText(str) {
    return this.chalk.italic(str);
  }
  styleOptionText(str) {
    return this.chalk.green(str);
  }
  styleArgumentText(str) {
    return this.chalk.yellow(str);
  }
  styleSubcommandText(str) {
    return this.chalk.blue(str);
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

// Override the color detection to use Chalk's detection.
// Chalk overrides color support based on the `FORCE_COLOR` environment variable,
// and looks for --color and --no-color command-line options.
// See https://github.com/chalk/chalk?tab=readme-ov-file#supportscolor
//
// In general we want stripColor() to be consistent with displayWidth().
program.configureOutput({
  getOutHasColors: () => supportsColorStdout,
  getErrHasColors: () => supportsColorStderr,
  stripColor: (str) => stripAnsi(str),
});

program.description('program description '.repeat(10));
program
  .option('-s', 'short description')
  .option('--long <number>', 'long description '.repeat(10))
  .option('--color', 'force color output') // implemented by chalk
  .option('--no-color', 'disable color output'); // implemented by chalk

program.addHelpText('after', (context) => {
  const chalk = context.error ? chalkStdErr : chalkStdOut;
  return chalk.italic('\nThis is additional help text.');
});

program.command('esses').description('sssss '.repeat(33));

program
  .command('print')
  .description('print files')
  .argument('<files...>', 'files to queue for printing')
  .option('--double-sided', 'print on both sides');

program.parse();

// Try the following (after installing the required packages):
//    node color-help-replacement.mjs --help
//    node color-help-replacement.mjs --no-color help
//    FORCE_COLOR=0 node color-help-replacement.mjs help
//    node color-help-replacement.mjs help print
