import { Argument } from './lib/argument.js';
import { Command } from './lib/command.js';
import { CommanderError, InvalidArgumentError } from './lib/error.js';
import { Help } from './lib/help.js';
import { Option } from './lib/option.js';

export const program = new Command();

export const createCommand = (name) => new Command(name);
export const createOption = (flags, description) =>
  new Option(flags, description);
export const createArgument = (name, description) =>
  new Argument(name, description);

/**
 * Expose classes
 */

export { Command, Option, Argument, Help };
export { CommanderError, InvalidArgumentError };
export { InvalidArgumentError as InvalidOptionArgumentError }; // Deprecated
