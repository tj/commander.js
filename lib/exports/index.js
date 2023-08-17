const { Argument } = require('../argument.js');
const { Command } = require('../command.js');
const { CommanderError, InvalidArgumentError } = require('../error.js');
const { Help } = require('../help.js');
const { Option } = require('../option.js');

const OriginalCommand = Command;

// This class is used during typings generation.
const Commander = class Command extends OriginalCommand {
  program = this; // more explicit access to global command
  Command = OriginalCommand;
  Argument = Argument;
  Option = Option;
  Help = Help;
  CommanderError = CommanderError;
  InvalidArgumentError = InvalidArgumentError;
  InvalidOptionArgumentError = InvalidArgumentError;
};

const commander = new Commander();
exports = module.exports = commander; // default export (deprecated)

exports.program = commander; // more explicit access to global command
// @ts-ignore
exports.createCommand = commander.createCommand;
// @ts-ignore
exports.createArgument = commander.createArgument;
// @ts-ignore
exports.createOption = commander.createOption;
exports.Command = Command;
exports.Argument = Argument;
exports.Option = Option;
exports.Help = Help;
exports.CommanderError = CommanderError;
exports.InvalidArgumentError = InvalidArgumentError;
exports.InvalidOptionArgumentError = InvalidArgumentError;
