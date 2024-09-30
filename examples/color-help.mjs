import { styleText } from 'node:util'; // from node v20.12.0
import { Command, Help } from 'commander';

class MyHelp extends Help {
  commandUsage(command) {
    return `${command.name()} ${styleText('green', '[options]')} ${styleText('yellow', '[command]')}`;
  }
  commandDescription(command) {
    return styleText('magenta', super.commandDescription(command));
  }
  optionTerm(option) {
    return styleText('green', option.flags);
  }
  optionDescription(option) {
    return styleText('italic', super.optionDescription(option));
  }
  subcommandTerm(command) {
    return styleText('yellow', super.subcommandTerm(command));
  }
  styleTitle(title) {
    return styleText('bold', title);
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

// Try the following:
//    node examples/color-help.mjs --help
