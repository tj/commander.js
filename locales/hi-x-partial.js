// Partial translation using strings from https://github.com/yargs/yargs/blob/main/locales/hi.json
// Starting point for full translation, PR welcome!

const translations = {
  // errors
  // commander.missingArgument
  "error: missing required argument '{0}'": "गलती: आवश्यक तर्क गुम '{0}'",
  // commander.optionMissingArgument
  // "error: option '{0}' argument missing": "error: option '{0}' argument missing",
  // commander.missingMandatoryOptionValue
  // "error: required option '{0}' not specified": "error: required option '{0}' not specified",
  // commander.conflictingOption
  // The environment variable is only displayed if caused conflict, and uses same format as in help.
  // e.g. option '-r, --rat' (env: RAT) cannot be used with option '-c, --cat'
  // "error: option '{0}'{1} cannot be used with option '{2}'{3}": "error: option '{0}'{1} cannot be used with option '{2}'{3}",
  // commander.unknownOption
  // "error: unknown option '{0}'": "error: unknown option '{0}'",
  // commander.unknownCommand
  // "error: unknown command '{0}'": "error: unknown command '{0}'",
  // commander.invalidArgument
  // - option from cli
  // "error: option '{0}' argument '{1}' is invalid.": "error: option '{0}' argument '{1}' is invalid.",
  // - choices, used for both option and argument
  // 'Allowed choices are {0}.': 'Allowed choices are {0}.',
  // - option from env
  // "error: option '{0}' value '{1}' from env '{2}' is invalid.": "error: option '{0}' value '{1}' from env '{2}' is invalid.",
  // - command-argument
  // "error: command-argument value '{0}' is invalid for argument '{1}'.": "error: command-argument value '{0}' is invalid for argument '{1}'.",
  // - commander.excessArguments
  // "error: too many arguments for command '{0}'": "error: too many arguments for command '{0}'",
  // 'error: too many arguments': 'error: too many arguments',

  // suggest similar
  // '(Did you mean one of {0}?)': '(Did you mean one of {0}?)',
  // '(Did you mean {0}?)': '(Did you mean {0}?)',

  // version option description
  'output the version number': 'Version संख्या दिखाएँ',
  // help option and help command description
  'display help for command': 'सहायता दिखाएँ',

  // Help
  // titles
  // 'Usage:': 'Usage:',
  'Arguments:': 'बहस:',
  'Options:': 'विकल्प:',
  'Commands:': 'आदेश:',
  // usage
  '[options]': '[विकल्प]',
  '[command]': '[आदेश]',
  // option details (after description)
  'choices: {0}': 'विकल्प: {0}',
  'default: {0}': 'डिफॉल्ट: {0}'
  // 'preset: {0}': 'preset: {0}',
  // 'env: {0}': 'env: {0}'
};

exports.translations = translations;
