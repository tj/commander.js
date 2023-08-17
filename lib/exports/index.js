const { Argument } = require('../argument.js');
const { Command } = require('../command.js');
const { CommanderError, InvalidArgumentError } = require('../error.js');
const { Help } = require('../help.js');
const { Option } = require('../option.js');

/**
 * Expose the root command.
 */

exports = module.exports = new Command();
exports.program = exports; // More explicit access to global command.
// Implicit export of createArgument, createCommand, and createOption.

/**
 * Expose classes
 */

exports.Argument = Argument;
exports.Command = Command;
exports.CommanderError = CommanderError;
exports.Help = Help;
exports.InvalidArgumentError = InvalidArgumentError;
exports.InvalidOptionArgumentError = InvalidArgumentError; // Deprecated
exports.Option = Option;
