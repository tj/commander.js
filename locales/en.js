// Example translation dictionary. The keys stay the same, and the values are the desired translation.

export const translations = {
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
  // commander.invalidArgument for option from cli
  "error: option '{0}' argument '{1}' is invalid.": "error: option '{0}' argument '{1}' is invalid.",
  // commander.invalidArgument for option from env
  "error: option '{0}' value '{1}' from env '{2}' is invalid.": "error: option '{0}' value '{1}' from env '{2}' is invalid.",
  // commander.invalidArgument for command-argument
  "error: command-argument value '{0}' is invalid for argument '{1}": "error: command-argument value '{0}' is invalid for argument '{1}."
  // ToDo
  // - choices error message for Option and Argument throwing commander.invalidArgument
  // - suggestSimilar for unknown option
  // - suggestSimilar for and unknown command
  // - commander.excessArguments
  //   rework for program/subcommand, plural, multiple arguments ????
  // - order of error/detail for right to left languages ????

  // need to lazy load translations after configureString has been added ????
  // help option
  // - translate where used, not called too often per command?
  // - see also visibleOptions
  // version option
  // help command
  // - see also visibleCommand

  // Help
  // - titles
  // - usage parts
  // - order of term/description for right to left languages ????
  // - option (default: 1, env: FOO, preset: 23) et al
};
