import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import {
  default as chalkStdOut,
  chalkStdErr,
  supportsColor as supportsColorStdout,
  supportsColorStderr,
} from 'chalk';
import { Command, Help } from 'commander';

// Replace default color and wrapping support with Chalk packages as an example of
// a deep replacement of format and style support.

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

  commandUsage(command) {
    return `${command.name()} ${this.chalk.green('[options]')} ${this.chalk.yellow('[command]')}`;
  }
  commandDescription(command) {
    return this.chalk.magenta(super.commandDescription(command));
  }
  optionTerm(option) {
    return this.chalk.green(option.flags);
  }
  optionDescription(option) {
    return this.chalk.italic(super.optionDescription(option));
  }
  subcommandTerm(command) {
    return this.chalk.yellow(super.subcommandTerm(command));
  }
  styleTitle(title) {
    return this.chalk.bold(title);
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
// In general we want stripAnsi() to be consistent with displayWidth().
program.configureOutput({
  getOutHasColors: () => supportsColorStdout,
  getErrHasColors: () => supportsColorStderr,
  stripAnsi: (str) => stripAnsi(str),
});

program.description('d '.repeat(100));
program
  .option('-s', 'short flag')
  .option('-f, --flag', 'short and long flag')
  .option('--long <number>', 'l '.repeat(100));

program
  .command('sub1', 'sssss '.repeat(33))
  .command('sub2', 'subcommand 2 description')
  .command('sub3', 'subcommand 3 description');

program.parse();

// Try the following (after installing the required packages):
//    node color-help-using-chalk.mjs --help
//    node color-help-using-chalk.mjs --color --help
//    node color-help-using-chalk.mjs --no-color --help
//    FORCE_COLOR=0 node color-help-using-chalk.mjs --help
