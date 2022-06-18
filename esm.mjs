import commander from './index.js';

// wrapper to provide named exports for ESM.
export const {
  program,
  createCommand,
  createArgument,
  createOption,
  CommanderError,
  InvalidArgumentError,
  InvalidArgumentError: InvalidOptionArgumentError,
  Command,
  Argument,
  Option,
  Help
} = commander;
