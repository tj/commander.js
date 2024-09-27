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
    const flags = [];
    if (option.short) {
      flags.push('-' + styleText('green', option.short.slice(1)));
    }
    if (option.long) {
      flags.push('--' + styleText('green', option.long.slice(2)));
    }
    return flags.join(', ');
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
  .option('--long', 'l '.repeat(100));

program
  .command('sub1', 'sssss '.repeat(33))
  .command('sub2', 'subcommand 2 description')
  .command('sub3', 'subcommand 3 description');

program.parse();
