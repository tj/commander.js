const Command = require('./lib/Command.js');
const Option = require('./lib/Option.js');

/**
 * A root command.
 * @type {Command}
 */
const command = new Command();

exports = module.exports = command;
exports.default = command;
exports.Command = Command;
exports.Option = Option;
