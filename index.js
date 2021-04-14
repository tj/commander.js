const { Argument } = require('./src/argument');
const { Command, Help } = require('./src/command');
const { CommanderError, InvalidOptionArgumentError } = require('./src/errors');
const { Option } = require('./src/option');

// @ts-check

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
