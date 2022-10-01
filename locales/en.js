// Example translation dictionary. The keys stay the same, and the values are the desired translation.

const translations = {
  // errors
  // commander.missingArgument
  "error: missing required argument '{0}'": "error: missing required argument '{0}'",
  // commander.optionMissingArgument
  "error: option '{0}' argument missing": "error: option '{0}' argument missing",
  // commander.missingMandatoryOptionValue
  "error: required option '{0}' not specified": "error: required option '{0}' not specified",
  // commander.conflictingOption
  'error: {0} cannot be used with {1}': 'error: {0} cannot be used with {1}',
  // commander.unknownOption
  "error: unknown option '{0}'": "error: unknown option '{0}'",
  // commander.unknownCommand
  "error: unknown command '{0}'": "error: unknown command '{0}'",
  // commander.invalidArgument
  // - option from cli
  "error: option '{0}' argument '{1}' is invalid.": "error: option '{0}' argument '{1}' is invalid.",
  // - choices
  'Allowed choices are {0}.': 'Allowed choices are {0}.',
  // - option from env
  "error: option '{0}' value '{1}' from env '{2}' is invalid.": "error: option '{0}' value '{1}' from env '{2}' is invalid.",
  // - command-argument
  "error: command-argument value '{0}' is invalid for argument '{1}": "error: command-argument value '{0}' is invalid for argument '{1}.",
  // ToDo
  // - commander.excessArguments
  //   rework for program/subcommand, plural, multiple arguments ????
  // - order of error/detail for right to left languages ????

  // suggest similar
  '\n(Did you mean one of {0}?)': '\n(Did you mean one of {0}?)',
  '\n(Did you mean {0}?)': '\n(Did you mean {0}?)',

  // help option, help command, version option
  // Needs refactor to work. Under user control anyway, so not essential.
  // help option
  // - see also visibleOptions
  // version option
  // help command
  // - see also visibleCommand

  // Help
  // titles
  'Usage:': 'Usage:',
  'Arguments:': 'Arguments:',
  'Options:': 'Options:',
  'Commands:': 'Commands:',
  // usage
  '[options]': '[options]',
  '[command]': '[command]',
  // option description
  'choices: {0}': 'choices: {0}',
  'default: {0}': 'default: {0}',
  'preset: {0}': 'preset: {0}',
  'env: {0}': 'env: {0}'
};

exports.translations = translations;
