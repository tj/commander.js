const { Argument } = require('../argument.js');
const { Command } = require('../command.js');
const { CommanderError, InvalidArgumentError } = require('../error.js');
const { Help } = require('../help.js');
const { Option } = require('../option.js');

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
