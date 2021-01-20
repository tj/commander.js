import commander from './index.js';

// wrapper to provide names exports for ESM.
export const { program, Option, Command, CommanderError, InvalidOptionArgumentError, Help, createCommand } = commander;
