/**
 * Module dependencies.
 */

const { CommanderError } = require('./lib/commanderError');
const { Command } = require('./lib/command');
const { Option } = require('./lib/option');

/**
 * Expose the root command.
 */
exports = module.exports = new Command();
exports.Command = Command;
exports.CommanderError = CommanderError;
exports.Option = Option;
