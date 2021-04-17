const { Argument } = require('./src/argument');
const { Command: BaseCommand } = require('./src/command');
const { CommanderError, InvalidOptionArgumentError } = require('./src/errors');
const { Option } = require('./src/option');
const { Help } = require('./src/help');

// @ts-check

// Supply the implementations of createHelp and createCommand, which only have
// placeholders in BaseCommand to avoid a circular dependency.

class Command extends BaseCommand {
  /**
   * Factory routine to create a new unattached command.
   *
   * See .command() for creating an attached subcommand, which uses this routine to
   * create the command. You can override createCommand to customise subcommands.
   *
   * @param {string} [name]
   * @return {Command} new command
   */

  createCommand(name) {
    return new Command(name);
  };

  /**
   * You can customise the help with a subclass of Help by overriding createHelp,
   * or by overriding Help properties using configureHelp().
   *
   * @return {Help}
   */

  createHelp() {
    return Object.assign(new Help(), this.configureHelp());
  };
}

/**
 * Expose the root command.
 */

exports = module.exports = new Command();
exports.program = exports; // More explicit access to global command.
// Implicit export of createArgument, createCommand, and createOption.

/**
 * Expose classes
 */

exports.Command = Command;
exports.Option = Option;
exports.Argument = Argument;
exports.CommanderError = CommanderError;
exports.InvalidOptionArgumentError = InvalidOptionArgumentError;
exports.Help = Help;
