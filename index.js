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
exports = module.exports = program;
exports.program = program; // more explicit access to global command (deprecated)

// Support aggregated import (import * as commander) in TypeScript.
// Do not delete these lines even if they seem redundant!
// @ts-ignore
exports.createCommand = program.createCommand;
// @ts-ignore
exports.createArgument = program.createArgument;
// @ts-ignore
exports.createOption = program.createOption;

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
