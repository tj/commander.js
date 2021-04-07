import commander from './index.js';

// wrapper to provide named exports for ESM.
export const { program, Option, Command, Argument, CommanderError, InvalidOptionArgumentError, Help, createCommand, createOption } = commander;
