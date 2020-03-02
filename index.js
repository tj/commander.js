/**
 * Module dependencies.
 */

const { CommanderError } = require('./lib/commanderError');
const { Command } = require('./lib/command');
const { Option } = require('./lib/option');

/**
 * Expose the root command.
 */
module.exports = new Command();
module.exports = { Command, CommanderError, Option };
