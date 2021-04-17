const { Argument } = require('./src/argument');
const { Command: BaseCommand } = require('./src/command');
const { CommanderError, InvalidOptionArgumentError } = require('./src/errors');
const { Option } = require('./src/option');
const { Help } = require('./src/help');

// @ts-check

class Command extends BaseCommand {
  /**
   * @inheritdoc
   */

  createCommand(...args) {
    return new Command(...args);
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

/**
 * Expose classes
 */

exports.Command = Command;
exports.Option = Option;
exports.Argument = Argument;
exports.CommanderError = CommanderError;
exports.InvalidOptionArgumentError = InvalidOptionArgumentError;
exports.Help = Help;
