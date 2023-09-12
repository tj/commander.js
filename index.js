const { Argument } = require('./lib/argument.js');
const { Command } = require('./lib/command.js');
const { CommanderError, InvalidArgumentError } = require('./lib/error.js');
const { Help } = require('./lib/help.js');
const { Option } = require('./lib/option.js');

// @ts-check

/**
 * Expose the root command.
 */

const program = new Command();
exports = module.exports = program; // default export (deprecated)
exports.program = program; // more explicit access to global command

// createArgument, createCommand, and createOption are implicitly available as they are methods on program.

/**
 * Expose classes
 */

exports.Command = Command;
exports.Option = Option;
exports.Argument = Argument;
exports.Help = Help;

exports.CommanderError = CommanderError;
exports.InvalidArgumentError = InvalidArgumentError;
exports.InvalidOptionArgumentError = InvalidArgumentError; // Deprecated
