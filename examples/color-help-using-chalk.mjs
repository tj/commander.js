import stripAnsi from 'strip-ansi';
import wrapAnsi from 'wrap-ansi';
import { default as chalk, supportsColor, supportsColorStderr } from 'chalk';
import { Command } from 'commander';

// Replace default color and wrapping support with Chalk packages. A similar approach
// should work with other color packages.

// This example requires chalk and wrap-ansi and strip-ansi, and won't run
// from a clone of Commander repo without installing them first.
//
// For example using npm:
//    npm install chalk wrap-ansi strip-ansi

const program = new Command();

// Override the color detection to use Chalk's detection.
// Chalk overrides color support based on the `FORCE_COLOR` environment variable,
// and looks for --color and --no-color command-line options.
// See https://github.com/chalk/chalk?tab=readme-ov-file#supportscolor
program.configureOutput({
  getOutHasColors: () => supportsColor,
  getErrHasColors: () => supportsColorStderr,
  stripAnsi: (str) => stripAnsi(str),
});

program.configureHelp({
  // Override the help formatting to use Chalk's strip and wrapping.
  // Note the hard-wrap will affect how the very long word in the program description is wrapped.
  displayWidth(str) {
    return stripAnsi(str).length;
  },
  boxWrap(str, width) {
    return wrapAnsi(str, width, { hard: true });
  },

  // Add some colour and a long description so we can see it working!
  commandDescription(cmd) {
    return chalk.italic(cmd.description());
  },
});

program.description(chalk.green('ddd '.repeat(40) + 'D'.repeat(200)));
program.option('--color', 'Colorize help');
program.option('--no-color', 'Turn off colour help');
program.parse();

// Try the following (after installing the required packages):
//    node color-help-using-chalk.mjs --help
//    node color-help-using-chalk.mjs --color --help
//    node color-help-using-chalk.mjs --no-color --help
//    FORCE_COLOR=0 node color-help-using-chalk.mjs --help
