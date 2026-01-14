import { Argument } from './lib/argument.mjs';
import { Command } from './lib/command.mjs';
import { CommanderError, InvalidArgumentError } from './lib/error.mjs';
import { Help } from './lib/help.mjs';
import { Option } from './lib/option.mjs';

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
