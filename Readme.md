# Commander.js

[![Build Status](https://github.com/tj/commander.js/workflows/build/badge.svg)](https://github.com/tj/commander.js/actions?query=workflow%3A%22build%22)
[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

The complete solution for [node.js](http://nodejs.org) command-line interfaces.

Read this in other languages: English | [简体中文](./Readme_zh-CN.md)

- [Commander.js](#commanderjs)
  - [Installation](#installation)
  - [Declaring _program_ variable](#declaring-program-variable)
  - [Options](#options)
    - [Common option types, boolean and value](#common-option-types-boolean-and-value)
    - [Default option value](#default-option-value)
    - [Other option types, negatable boolean and boolean|value](#other-option-types-negatable-boolean-and-booleanvalue)
    - [Required option](#required-option)
    - [Variadic option](#variadic-option)
    - [Version option](#version-option)
    - [More configuration](#more-configuration)
    - [Custom option processing](#custom-option-processing)
  - [Commands](#commands)
    - [Command-arguments](#command-arguments)
      - [More configuration](#more-configuration-1)
      - [Custom argument processing](#custom-argument-processing)
    - [Action handler](#action-handler)
    - [Stand-alone executable (sub)commands](#stand-alone-executable-subcommands)
    - [Life cycle hooks](#life-cycle-hooks)
  - [Automated help](#automated-help)
    - [Custom help](#custom-help)
    - [Display help after errors](#display-help-after-errors)
    - [Display help from code](#display-help-from-code)
    - [.usage and .name](#usage-and-name)
    - [.helpOption(flags, description)](#helpoptionflags-description)
    - [.addHelpCommand()](#addhelpcommand)
    - [More configuration](#more-configuration-2)
  - [Custom event listeners](#custom-event-listeners)
  - [Bits and pieces](#bits-and-pieces)
    - [.parse() and .parseAsync()](#parse-and-parseasync)
    - [Parsing Configuration](#parsing-configuration)
    - [Legacy options as properties](#legacy-options-as-properties)
    - [TypeScript](#typescript)
    - [createCommand()](#createcommand)
    - [Node options such as `--harmony`](#node-options-such-as---harmony)
    - [Debugging stand-alone executable subcommands](#debugging-stand-alone-executable-subcommands)
    - [Override exit and output handling](#override-exit-and-output-handling)
    - [Additional documentation](#additional-documentation)
  - [Examples](#examples)
  - [Support](#support)
    - [Commander for enterprise](#commander-for-enterprise)

For information about terms used in this document see: [terminology](./docs/terminology.md)

## Installation

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/installation.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/installation.sh -->
```sh
npm install commander
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## Declaring _program_ variable

Commander exports a global object which is convenient for quick programs.
This is used in the examples in this README for brevity.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example1.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/program-variable-example1.js -->
```js
const { program } = require('commander');
program.version('0.0.1');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

For larger programs which may use commander in multiple ways, including unit testing, it is better to create a local Command object to use.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example2.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/program-variable-example2.js -->
```js
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

For named imports in ECMAScript modules, import from `commander/esm.mjs`.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example3.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/program-variable-example3.js -->
```js
// index.mjs
import { Command } from 'commander/esm.mjs';
const program = new Command();
```
<!-- MARKDOWN-AUTO-DOCS:END -->

And in TypeScript:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example4.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/program-variable-example4.js -->
```js
// index.ts
import { Command } from 'commander';
const program = new Command();
```
<!-- MARKDOWN-AUTO-DOCS:END -->


## Options

Options are defined with the `.option()` method, also serving as documentation for the options. Each option can have a short flag (single character) and a long name, separated by a comma or space or vertical bar ('|').

The parsed options can be accessed by calling `.opts()` on a `Command` object, and are passed to the action handler.
You can also use `.getOptionValue()` and `.setOptionValue()` to work with a single option value.

Multi-word options such as "--template-engine" are camel-cased, becoming `program.opts().templateEngine` etc.

Multiple short flags may optionally be combined in a single argument following the dash: boolean flags, followed by a single option taking a value (possibly followed by the value).
For example `-a -b -p 80` may be written as `-ab -p80` or even `-abp80`.

You can use `--` to indicate the end of the options, and any remaining arguments will be used without being interpreted.

By default options on the command line are not positional, and can be specified before or after other arguments.

### Common option types, boolean and value

The two most used option types are a boolean option, and an option which takes its value
from the following argument (declared with angle brackets like `--expect <value>`). Both are `undefined` unless specified on command line.  

Example file: [options-common.js](./examples/options-common.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-common.js) -->
<!-- The below code snippet is automatically added from ./examples/options-common.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Common option types, boolean and value

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);

// Try the following:
//    node options-common.js -p
//    node options-common.js -d -s -p vegetarian
//    node options-common.js --pizza-type=cheese
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/common-option-types-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/common-option-types-cli.sh -->
```sh
$ pizza-options -p
error: option '-p, --pizza-type <type>' argument missing
$ pizza-options -d -s -p vegetarian
{ debug: true, small: true, pizzaType: 'vegetarian' }
pizza details:
- small pizza size
- vegetarian
$ pizza-options --pizza-type=cheese
pizza details:
- cheese
```
<!-- MARKDOWN-AUTO-DOCS:END -->

`program.parse(arguments)` processes the arguments, leaving any args not consumed by the program options in the `program.args` array. The parameter is optional and defaults to `process.argv`.

### Default option value

You can specify a default value for an option which takes a value.

Example file: [options-defaults.js](./examples/options-defaults.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-defaults.js) -->
<!-- The below code snippet is automatically added from ./examples/options-defaults.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Default option value

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-c, --cheese <type>', 'Add the specified type of cheese', 'blue');

program.parse();

console.log(`cheese: ${program.opts().cheese}`);

// Try the following:
//    node options-defaults.js
//    node options-defaults.js --cheese stilton
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-defaults-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-defaults-cli.sh -->
```sh
$ pizza-options
cheese: blue
$ pizza-options --cheese stilton
cheese: stilton
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Other option types, negatable boolean and boolean|value

You can define a boolean option long name with a leading `no-` to set the option value to false when used.
Defined alone this also makes the option true by default.

If you define `--foo` first, adding `--no-foo` does not change the default value from what it would
otherwise be. You can specify a default boolean value for a boolean option and it can be overridden on command line.

Example file: [options-negatable.js](./examples/options-negatable.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-negatable.js) -->
<!-- The below code snippet is automatically added from ./examples/options-negatable.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Other option types, negatable boolean
//    You can specify a boolean option long name with a leading `no-` to make it true by default and able to be negated.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('--no-sauce', 'Remove sauce')
  .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
  .option('--no-cheese', 'plain with no cheese');

program.parse();

const options = program.opts();
const sauceStr = options.sauce ? 'sauce' : 'no sauce';
const cheeseStr = (options.cheese === false) ? 'no cheese' : `${options.cheese} cheese`;
console.log(`You ordered a pizza with ${sauceStr} and ${cheeseStr}`);

// Try the following:
//    node options-negatable.js
//    node options-negatable.js --sauce
//    node options-negatable.js --cheese=blue
//    node options-negatable.js --no-sauce --no-cheese
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-negatable-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-negatable-cli.sh -->
```sh
$ pizza-options
You ordered a pizza with sauce and mozzarella cheese
$ pizza-options --sauce
error: unknown option '--sauce'
$ pizza-options --cheese=blue
You ordered a pizza with sauce and blue cheese
$ pizza-options --no-sauce --no-cheese
You ordered a pizza with no sauce and no cheese
```
<!-- MARKDOWN-AUTO-DOCS:END -->

You can specify an option which may be used as a boolean option but may optionally take an option-argument
(declared with square brackets like `--optional [value]`).

Example file: [options-boolean-or-value.js](./examples/options-boolean-or-value.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-boolean-or-value.js) -->
<!-- The below code snippet is automatically added from ./examples/options-boolean-or-value.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Other option types, flag|value
//    You can specify an option which functions as a flag but may also take a value (declared using square brackets).

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-c, --cheese [type]', 'Add cheese with optional type');

program.parse(process.argv);

const options = program.opts();
if (options.cheese === undefined) console.log('no cheese');
else if (options.cheese === true) console.log('add cheese');
else console.log(`add cheese type ${options.cheese}`);

// Try the following:
//    node options-boolean-or-value
//    node options-boolean-or-value --cheese
//    node options-boolean-or-value --cheese mozzarella
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-boolean-or-value-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-boolean-or-value-cli.sh -->
```sh
$ pizza-options
no cheese
$ pizza-options --cheese
add cheese
$ pizza-options --cheese mozzarella
add cheese type mozzarella
```
<!-- MARKDOWN-AUTO-DOCS:END -->

For information about possible ambiguous cases, see [options taking varying arguments](./docs/options-taking-varying-arguments.md).

### Required option

You may specify a required (mandatory) option using `.requiredOption`. The option must have a value after parsing, usually specified on the command line, or perhaps from a default value (say from environment). The method is otherwise the same as `.option` in format, taking flags and description, and optional default value or custom processing.

Example file: [options-required.js](./examples/options-required.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-required.js) -->
<!-- The below code snippet is automatically added from ./examples/options-required.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Required option
//    You may specify a required (mandatory) option using `.requiredOption`.
//    The option must be specified on the command line, or by having a default value.
//
// Example output pretending command called pizza (or try directly with `node options-required.js`)
//
// $ pizza
// error: required option '-c, --cheese <type>' not specified

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse();
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-required-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-required-cli.sh -->
```sh
$ pizza
error: required option '-c, --cheese <type>' not specified
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Variadic option

You may make an option variadic by appending `...` to the value placeholder when declaring the option. On the command line you
can then specify multiple option-arguments, and the parsed option value will be an array. The extra arguments
are read until the first argument starting with a dash. The special argument `--` stops option processing entirely. If a value
is specified in the same argument as the option then no further values are read.

Example file: [options-variadic.js](./examples/options-variadic.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-variadic.js) -->
<!-- The below code snippet is automatically added from ./examples/options-variadic.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for variadic options.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .option('-n, --number <value...>', 'specify numbers')
  .option('-l, --letter [value...]', 'specify letters');

program.parse();

console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);

// Try the following:
//  node options-variadic.js -n 1 2 3 --letter a b c
//  node options-variadic.js --letter=A -n80 operand
//  node options-variadic.js --letter -n 1 -n 2 3 -- operand
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-variadic-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-variadic-cli.sh -->
```sh
$ collect -n 1 2 3 --letter a b c
Options:  { number: [ '1', '2', '3' ], letter: [ 'a', 'b', 'c' ] }
Remaining arguments:  []
$ collect --letter=A -n80 operand
Options:  { number: [ '80' ], letter: [ 'A' ] }
Remaining arguments:  [ 'operand' ]
$ collect --letter -n 1 -n 2 3 -- operand
Options:  { number: [ '1', '2', '3' ], letter: true }
Remaining arguments:  [ 'operand' ]
```
<!-- MARKDOWN-AUTO-DOCS:END -->

For information about possible ambiguous cases, see [options taking varying arguments](./docs/options-taking-varying-arguments.md).

### Version option

The optional `version` method adds handling for displaying the command version. The default option flags are `-V` and `--version`, and when present the command prints the version number and exits.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/version-option.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/version-option.js -->
```js
program.version('0.0.1');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

You may change the flags and description by passing additional parameters to the `version` method, using
the same syntax for flags as the `option` method.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/version-option-additional-parameter.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/version-option-additional-parameter.js -->
```js
program.version('0.0.1', '-v, --vers', 'output the current version');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### More configuration

You can add most options using the `.option()` method, but there are some additional features available
by constructing an `Option` explicitly for less common cases.

Example file: [options-extra.js](./examples/options-extra.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-extra.js) -->
<!-- The below code snippet is automatically added from ./examples/options-extra.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for extra option features.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .addOption(new commander.Option('-s, --secret').hideHelp())
  .addOption(new commander.Option('-t, --timeout <delay>', 'timeout in seconds').default(60, 'one minute'))
  .addOption(new commander.Option('-d, --drink <size>', 'drink cup size').choices(['small', 'medium', 'large']));

program.parse();

console.log('Options: ', program.opts());

// Try the following:
//  node options-extra.js --help
//  node options-extra.js --drink huge
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-extra-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-extra-cli.sh -->
```sh
$ extra --help
Usage: help [options]

Options:
  -t, --timeout <delay>  timeout in seconds (default: one minute)
  -d, --drink <size>     drink cup size (choices: "small", "medium", "large")
  -h, --help             display help for command

$ extra --drink huge
error: option '-d, --drink <size>' argument 'huge' is invalid. Allowed choices are small, medium, large.
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Custom option processing

You may specify a function to do custom processing of option-arguments. The callback function receives two parameters,
the user specified option-argument and the previous value for the option. It returns the new value for the option.

This allows you to coerce the option-argument to the desired type, or accumulate values, or do entirely custom processing.

You can optionally specify the default/starting value for the option after the function parameter.

Example file: [options-custom-processing.js](./examples/options-custom-processing.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-custom-processing.js) -->
<!-- The below code snippet is automatically added from ./examples/options-custom-processing.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Custom option processing
//    You may specify a function to do custom processing of option values.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

program
  .option('-f, --float <number>', 'float argument', parseFloat)
  .option('-i, --integer <number>', 'integer argument', myParseInt)
  .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
  .option('-c, --collect <value>', 'repeatable value', collect, [])
  .option('-l, --list <items>', 'comma separated list', commaSeparatedList)
;

program.parse();

const options = program.opts();
if (options.float !== undefined) console.log(`float: ${options.float}`);
if (options.integer !== undefined) console.log(`integer: ${options.integer}`);
if (options.verbose > 0) console.log(`verbosity: ${options.verbose}`);
if (options.collect.length > 0) console.log(options.collect);
if (options.list !== undefined) console.log(options.list);

// Try the following:
//    node options-custom-processing -f 1e2
//    node options-custom-processing --integer 2
//    node options-custom-processing -v -v -v
//    node options-custom-processing -c a -c b -c c
//    node options-custom-processing --list x,y,z
```
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-custom-processing-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/options-custom-processing-cli.sh -->
```sh
$ custom -f 1e2
float: 100
$ custom --integer 2
integer: 2
$ custom -v -v -v
verbose: 3
$ custom -c a -c b -c c
[ 'a', 'b', 'c' ]
$ custom --list x,y,z
[ 'x', 'y', 'z' ]
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## Commands

You can specify (sub)commands using `.command()` or `.addCommand()`. There are two ways these can be implemented: using an action handler attached to the command, or as a stand-alone executable file (described in more detail later). The subcommands may be nested ([example](./examples/nestedCommands.js)).

In the first parameter to `.command()` you specify the command name. You may append the command-arguments after the command name, or specify them separately using `.argument()`. The arguments may be `<required>` or `[optional]`, and the last argument may also be `variadic...`.

You can use `.addCommand()` to add an already configured subcommand to the program.

For example:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/command.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/command.js -->
```js
// Command implemented using action handler (description is supplied separately to `.command`)
// Returns new command for configuring.
program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  });

// Command implemented using stand-alone executable file, indicated by adding description as second parameter to `.command`.
// Returns `this` for adding more commands.
program
  .command('start <service>', 'start named service')
  .command('stop [service]', 'stop named service, or all if no name supplied');

// Command prepared separately.
// Returns `this` for adding more commands.
program
  .addCommand(build.makeBuildCommand());
```
<!-- MARKDOWN-AUTO-DOCS:END -->

Configuration options can be passed with the call to `.command()` and `.addCommand()`. Specifying `hidden: true` will 
remove the command from the generated help output. Specifying `isDefault: true` will run the subcommand if no other
subcommand is specified ([example](./examples/defaultCommand.js)).

### Command-arguments

For subcommands, you can specify the argument syntax in the call to `.command()` (as shown above). This
is the only method usable for subcommands implemented using a stand-alone executable, but for other subcommands
you can instead use the following method.

To configure a command, you can use `.argument()` to specify each expected command-argument. 
You supply the argument name and an optional description. The argument may be `<required>` or `[optional]`.
You can specify a default value for an optional command-argument.

Example file: [argument.js](./examples/argument.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/argument.js) -->
<!-- The below code snippet is automatically added from ./examples/argument.js -->
```js
#!/usr/bin/env node

// This example shows specifying the arguments using argument() function.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .version('0.1.0')
  .argument('<username>', 'user to login')
  .argument('[password]', 'password for user, if required', 'no password given')
  .description('example program for argument')
  .action((username, password) => {
    console.log('username:', username);
    console.log('password:', password);
  });

program.parse();

// Try the following:
//    node arguments.js --help
//    node arguments.js user
//    node arguments.js user secret
```
<!-- MARKDOWN-AUTO-DOCS:END -->

 The last argument of a command can be variadic, and only the last argument.  To make an argument variadic you
 append `...` to the argument name. A variadic argument is passed to the action handler as an array. For example:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/vardiac-argument.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/vardiac-argument.js -->
```js
program
  .version('0.1.0')
  .command('rmdir')
  .argument('<dirs...>')
  .action(function (dirs) {
    dirs.forEach((dir) => {
      console.log('rmdir %s', dir);
    });
  });
```
<!-- MARKDOWN-AUTO-DOCS:END -->

There is a convenience method to add multiple arguments at once, but without descriptions:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/multiple-arguments.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/multiple-arguments.js -->
```js
program
  .arguments('<username> <password>');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

#### More configuration

There are some additional features available by constructing an `Argument` explicitly for less common cases.

Example file: [arguments-extra.js](./examples/arguments-extra.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/arguments-extra.js) -->
<!-- The below code snippet is automatically added from ./examples/arguments-extra.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for extra argument features.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

program
  .addArgument(new commander.Argument('<drink-size>', 'drink cup size').choices(['small', 'medium', 'large']))
  .addArgument(new commander.Argument('[timeout]', 'timeout in seconds').default(60, 'one minute'))
  .action((drinkSize, timeout) => {
    console.log(`Drink size: ${drinkSize}`);
    console.log(`Timeout (s): ${timeout}`);
  });

program.parse();

// Try the following:
//  node arguments-extra.js --help
//  node arguments-extra.js huge
//  node arguments-extra.js small
//  node arguments-extra.js medium 30
```
<!-- MARKDOWN-AUTO-DOCS:END -->

#### Custom argument processing

You may specify a function to do custom processing of command-arguments (like for option-arguments).
The callback function receives two parameters, the user specified command-argument and the previous value for the argument.
It returns the new value for the argument.

The processed argument values are passed to the action handler, and saved as `.processedArgs`.

You can optionally specify the default/starting value for the argument after the function parameter.

Example file: [arguments-custom-processing.js](./examples/arguments-custom-processing.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/arguments-custom-processing.js) -->
<!-- The below code snippet is automatically added from ./examples/arguments-custom-processing.js -->
```js
#!/usr/bin/env node

// This is used as an example in the README for:
//    Custom argument processing
//    You may specify a function to do custom processing of argument values.

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

// The previous value passed to the custom processing is used when processing variadic values.
function mySum(value, total) {
  return total + myParseInt(value);
}

program
  .command('add')
  .argument('<first>', 'integer argument', myParseInt)
  .argument('[second]', 'integer argument', myParseInt, 1000)
  .action((first, second) => {
    console.log(`${first} + ${second} = ${first + second}`);
  });

program
  .command('sum')
  .argument('<value...>', 'values to be summed', mySum, 0)
  .action((total) => {
    console.log(`sum is ${total}`);
  });

program.parse();

// Try the following:
//    node arguments-custom-processing add --help
//    node arguments-custom-processing add 2
//    node arguments-custom-processing add 12 56
//    node arguments-custom-processing sum 1 2 3
//    node arguments-custom-processing sum silly
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Action handler

The action handler gets passed a parameter for each command-argument you declared, and two additional parameters
which are the parsed options and the command object itself. 

Example file: [thank.js](./examples/thank.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/thank.js) -->
<!-- The below code snippet is automatically added from ./examples/thank.js -->
```js
#!/usr/bin/env node

// This example is used as an example in the README for the action handler.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .argument('<name>')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, options, command) => {
    if (options.debug) {
      console.error('Called %s with options %o', command.name(), options);
    }
    const title = options.title ? `${options.title} ` : '';
    console.log(`Thank-you ${title}${name}`);
  });

program.parse();

// Try the following:
//   node thank.js John
//   node thank.js Doe --title Mr
//   node thank.js --debug Doe --title Mr
```
<!-- MARKDOWN-AUTO-DOCS:END -->

You may supply an `async` action handler, in which case you call `.parseAsync` rather than `.parse`.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/async-action-handler.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/async-action-handler.js -->
```js
async function run() { /* code goes here */ }

async function main() {
  program
    .command('run')
    .action(run);
  await program.parseAsync(process.argv);
}
```
<!-- MARKDOWN-AUTO-DOCS:END -->

A command's options and arguments on the command line are validated when the command is used. Any unknown options or missing arguments will be reported as an error. You can suppress the unknown option checks with `.allowUnknownOption()`. By default it is not an error to
pass more arguments than declared, but you can make this an error with `.allowExcessArguments(false)`.

### Stand-alone executable (sub)commands

When `.command()` is invoked with a description argument, this tells Commander that you're going to use stand-alone executables for subcommands.
Commander will search the executables in the directory of the entry script (like `./examples/pm`) with the name `program-subcommand`, like `pm-install`, `pm-search`.
You can specify a custom name with the `executableFile` configuration option.

You handle the options for an executable (sub)command in the executable, and don't declare them at the top-level.

Example file: [pm](./examples/pm)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/pm) -->
<!-- The below code snippet is automatically added from ./examples/pm -->
```
#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .version('0.0.1')
  .description('Fake package manager')
  .command('install [name]', 'install one or more packages').alias('i')
  .command('search [query]', 'search with optional query').alias('s')
  .command('update', 'update installed packages', { executableFile: 'myUpdateSubCommand' })
  .command('list', 'list packages installed', { isDefault: true });

program.parse(process.argv);

// here .command() is invoked with a description,
// and no .action(callback) calls to handle sub-commands.
// this tells commander that you're going to use separate
// executables for sub-commands, much like git(1) and other
// popular tools.

// here only ./pm-install(1) and ./pm-list(1) are implemented, however you
// would define ./pm-search(1) etc.

// Try the following:
//   ./examples/pm
//   ./examples/pm help install
//   ./examples/pm install -h
//   ./examples/pm install foo bar baz
//   ./examples/pm install foo bar baz --force
```
<!-- MARKDOWN-AUTO-DOCS:END -->

If the program is designed to be installed globally, make sure the executables have proper modes, like `755`.

### Life cycle hooks

You can add callback hooks to a command for life cycle events.

Example file: [hook.js](./examples/hook.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/hook.js) -->
<!-- The below code snippet is automatically added from ./examples/hook.js -->
```js
#!/usr/bin/env node

// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo
const program = new commander.Command();

// This example shows using some hooks for life cycle events.

const timeLabel = 'command duration';
program
  .option('-p, --profile', 'show how long command takes')
  .hook('preAction', (thisCommand) => {
    if (thisCommand.opts().profile) {
      console.time(timeLabel);
    }
  })
  .hook('postAction', (thisCommand) => {
    if (thisCommand.opts().profile) {
      console.timeEnd(timeLabel);
    }
  });

program
  .option('-t, --trace', 'display trace statements for commands')
  .hook('preAction', (thisCommand, actionCommand) => {
    if (thisCommand.opts().trace) {
      console.log('>>>>');
      console.log(`About to call action handler for subcommand: ${actionCommand.name()}`);
      console.log('arguments: %O', actionCommand.args);
      console.log('options: %o', actionCommand.opts());
      console.log('<<<<');
    }
  });

program.command('delay')
  .option('--message <value>', 'custom message to display', 'Thanks for waiting')
  .argument('[seconds]', 'how long to delay', '1')
  .action(async(waitSeconds, options) => {
    await new Promise(resolve => setTimeout(resolve, parseInt(waitSeconds) * 1000));
    console.log(options.message);
  });

program.command('hello')
  .option('-e, --example')
  .action(() => console.log('Hello, world'));

// Some of the hooks or actions are async, so call parseAsync rather than parse.
program.parseAsync().then(() => {});

// Try the following:
//  node hook.js hello
//  node hook.js --profile hello
//  node hook.js --trace hello --example
//  node hook.js delay
//  node hook.js --trace delay 5 --message bye
//  node hook.js --profile delay
```
<!-- MARKDOWN-AUTO-DOCS:END -->

The callback hook can be `async`, in which case you call `.parseAsync` rather than `.parse`. You can add multiple hooks per event.

The supported events are:

- `preAction`: called before action handler for this command and its subcommands
- `postAction`: called after action handler for this command and its subcommands

The hook is passed the command it was added to, and the command running the action handler.

## Automated help

The help information is auto-generated based on the information commander already knows about your program. The default
help option is `-h,--help`.

Example file: [pizza](./examples/pizza)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/pizza) -->
<!-- The below code snippet is automatically added from ./examples/pizza -->
```
#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .description('An application for pizza ordering')
  .option('-p, --peppers', 'Add peppers')
  .option('-c, --cheese <type>', 'Add the specified type of cheese', 'marble')
  .option('-C, --no-cheese', 'You do not want any cheese');

program.parse();

const options = program.opts();
console.log('you ordered a pizza with:');
if (options.peppers) console.log('  - peppers');
const cheese = !options.cheese ? 'no' : options.cheese;
console.log('  - %s cheese', cheese);
```
<!-- MARKDOWN-AUTO-DOCS:END -->

A `help` command is added by default if your command has subcommands. It can be used alone, or with a subcommand name to show
further help for the subcommand. These are effectively the same if the `shell` program has implicit help:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/automated-help-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/automated-help-cli.sh -->
```sh
shell help
shell --help

shell help spawn
shell spawn --help
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Custom help

You can add extra text to be displayed along with the built-in help. 

Example file: [custom-help](./examples/custom-help)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/custom-help) -->
<!-- The below code snippet is automatically added from ./examples/custom-help -->
```
#!/usr/bin/env node

// This example shows a simple use of addHelpText.
// This is used as an example in the README.

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .option('-f, --foo', 'enable some foo');

program.addHelpText('after', `

Example call:
  $ custom-help --help`);

program.parse(process.argv);

// Try the following:
//  node custom-help --help
```
<!-- MARKDOWN-AUTO-DOCS:END -->

Yields the following help output:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/custom-help-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/custom-help-cli.sh -->
```sh
Usage: custom-help [options]

Options:
  -f, --foo   enable some foo
  -h, --help  display help for command

Example call:
  $ custom-help --help
```
<!-- MARKDOWN-AUTO-DOCS:END -->

The positions in order displayed are:

- `beforeAll`: add to the program for a global banner or header
- `before`: display extra information before built-in help
- `after`: display extra information after built-in help
- `afterAll`: add to the program for a global footer (epilog)

The positions "beforeAll" and "afterAll" apply to the command and all its subcommands. 

The second parameter can be a string, or a function returning a string. The function is passed a context object for your convenience. The properties are:

- error: a boolean for whether the help is being displayed due to a usage error
- command: the Command which is displaying the help

### Display help after errors

The default behaviour for usage errors is to just display a short error message. 
You can change the behaviour to show the full help or a custom help message after an error.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/display-help.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/display-help.js -->
```js
program.showHelpAfterError();
// or
program.showHelpAfterError('(add --help for additional information)');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Display help from code

`.help()`: display help information and exit immediately. You can optionally pass `{ error: true }` to display on stderr and exit with an error status.

`.outputHelp()`: output help information without exiting. You can optionally pass `{ error: true }` to display on stderr.

`.helpInformation()`: get the built-in command help information as a string for processing or displaying yourself.

### .usage and .name

These allow you to customise the usage description in the first line of the help. The name is otherwise
deduced from the (full) program arguments. Given:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/usage.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/usage.js -->
```js
program
  .name("my-command")
  .usage("[global options] command")
```
<!-- MARKDOWN-AUTO-DOCS:END -->

The help will start with:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/usage-cli.sh) -->
<!-- The below code snippet is automatically added from ./examples/Readme/usage-cli.sh -->
```sh
Usage: my-command [global options] command
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### .helpOption(flags, description)

By default every command has a help option. Override the default help flags and description. Pass false to disable the built-in help option.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/help-option.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/help-option.js -->
```js
program
  .helpOption('-e, --HELP', 'read more information');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### .addHelpCommand()

A help command is added by default if your command has subcommands. You can explicitly turn on or off the implicit help command with `.addHelpCommand()` and `.addHelpCommand(false)`.

You can both turn on and customise the help command by supplying the name and description:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/add-help-command.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/add-help-command.js -->
```js
program.addHelpCommand('assist [command]', 'show assistance');
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### More configuration

The built-in help is formatted using the Help class.
You can configure the Help behaviour by modifying data properties and methods using `.configureHelp()`, or by subclassing using `.createHelp()` if you prefer.

The data properties are:

- `helpWidth`: specify the wrap width, useful for unit tests
- `sortSubcommands`: sort the subcommands alphabetically
- `sortOptions`: sort the options alphabetically

There are methods getting the visible lists of arguments, options, and subcommands. There are methods for formatting the items in the lists, with each item having a _term_ and _description_. Take a look at `.formatHelp()` to see how they are used.

Example file: [configure-help.js](./examples/configure-help.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/configure-help.js) -->
<!-- The below code snippet is automatically added from ./examples/configure-help.js -->
```js
// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

const program = new commander.Command();

// This example shows a simple use of configureHelp.
// This is used as an example in the README.

program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() // Just show the name, instead of short usage.
});

program.command('zebra <herd-size>', 'African equines with distinctive black-and-white striped coats');
program.command('aardvark [colour]', 'medium-sized, burrowing, nocturnal mammal');
program
  .command('beaver', 'large, semiaquatic rodent')
  .option('--pond')
  .option('--river');

program.parse();

// Try the following:
// node configure-help.js --help
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## Custom event listeners

You can execute custom actions by listening to command and option events.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/custom-event-listeners.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/custom-event-listeners.js -->
```js
program.on('option:verbose', function () {
  process.env.VERBOSE = this.opts().verbose;
});

program.on('command:*', function (operands) {
  console.error(`error: unknown command '${operands[0]}'`);
  const availableCommands = program.commands.map(cmd => cmd.name());
  mySuggestBestMatch(operands[0], availableCommands);
  process.exitCode = 1;
});
```
<!-- MARKDOWN-AUTO-DOCS:END -->

## Bits and pieces

### .parse() and .parseAsync()

The first argument to `.parse` is the array of strings to parse. You may omit the parameter to implicitly use `process.argv`.

If the arguments follow different conventions than node you can pass a `from` option in the second parameter:

- 'node': default, `argv[0]` is the application and `argv[1]` is the script being run, with user parameters after that
- 'electron': `argv[1]` varies depending on whether the electron application is packaged
- 'user': all of the arguments from the user

For example:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/parse.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/parse.js -->
```js
program.parse(process.argv); // Explicit, node conventions
program.parse(); // Implicit, and auto-detect electron
program.parse(['-f', 'filename'], { from: 'user' });
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Parsing Configuration

If the default parsing does not suit your needs, there are some behaviours to support other usage patterns.

By default program options are recognised before and after subcommands. To only look for program options before subcommands, use `.enablePositionalOptions()`. This lets you use
an option for a different purpose in subcommands.

Example file: [positional-options.js](./examples/positional-options.js)
<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/positional-options.js) -->
<!-- The below code snippet is automatically added from ./examples/positional-options.js -->
```js
#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .enablePositionalOptions()
  .option('-p, --progress');

program
  .command('upload <file>')
  .option('-p, --port <number>', 'port number', 80)
  .action((file, options) => {
    if (program.opts().progress) console.log('Starting upload...');
    console.log(`Uploading ${file} to port ${options.port}`);
    if (program.opts().progress) console.log('Finished upload');
  });

program.parse();

// Try the following:
//
//    node positional-options.js upload test.js
//    node positional-options.js -p upload test.js
//    node positional-options.js upload -p 8080 test.js
//    node positional-options.js -p upload -p 8080 test.js
```
<!-- MARKDOWN-AUTO-DOCS:END -->

With positional options, the `-b` is a program option in the first line and a subcommand option in the second line:

```sh
program -b subcommand
program subcommand -b
```

By default options are recognised before and after command-arguments. To only process options that come
before the command-arguments, use `.passThroughOptions()`. This lets you pass the  arguments and following options through to another program
without needing to use `--` to end the option processing. 
To use pass through options in a subcommand, the program needs to enable positional options.

Example file: [pass-through-options.js]( ./examples/pass-through-options.js)
<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/positional-options.js) -->
<!-- The below code snippet is automatically added from ./examples/positional-options.js -->
```js
#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .enablePositionalOptions()
  .option('-p, --progress');

program
  .command('upload <file>')
  .option('-p, --port <number>', 'port number', 80)
  .action((file, options) => {
    if (program.opts().progress) console.log('Starting upload...');
    console.log(`Uploading ${file} to port ${options.port}`);
    if (program.opts().progress) console.log('Finished upload');
  });

program.parse();

// Try the following:
//
//    node positional-options.js upload test.js
//    node positional-options.js -p upload test.js
//    node positional-options.js upload -p 8080 test.js
//    node positional-options.js -p upload -p 8080 test.js
```
<!-- MARKDOWN-AUTO-DOCS:END -->

With pass through options, the `--port=80` is a program option in the first line and passed through as a command-argument in the second line:

```sh
program --port=80 arg
program arg --port=80
```

By default the option processing shows an error for an unknown option. To have an unknown option treated as an ordinary command-argument and continue looking for options, use `.allowUnknownOption()`. This lets you mix known and unknown options.

By default the argument processing does not display an error for more command-arguments than expected.
To display an error for excess arguments, use`.allowExcessArguments(false)`.

### Legacy options as properties 

Before Commander 7, the option values were stored as properties on the command.
This was convenient to code but the downside was possible clashes with
existing properties of `Command`. You can revert to the old behaviour to run unmodified legacy code by using `.storeOptionsAsProperties()`.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/legacy-options-properties.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/legacy-options-properties.js -->
```js
program
  .storeOptionsAsProperties()
  .option('-d, --debug')
  .action((commandAndOptions) => {
    if (commandAndOptions.debug) {
      console.error(`Called ${commandAndOptions.name()}`);
    }
  });
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### TypeScript

If you use `ts-node` and  stand-alone executable subcommands written as `.ts` files, you need to call your program through node to get the subcommands called correctly. e.g.

```bash
node -r ts-node/register pm.ts
```

### createCommand()

This factory function creates a new command. It is exported and may be used instead of using `new`, like:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/create-command.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/create-command.js -->
```js
const { createCommand } = require('commander');
const program = createCommand();
```
<!-- MARKDOWN-AUTO-DOCS:END -->

`createCommand` is also a method of the Command object, and creates a new command rather than a subcommand. This gets used internally
when creating subcommands using `.command()`, and you may override it to
customise the new subcommand (example file [custom-command-class.js](./examples/custom-command-class.js)).

### Node options such as `--harmony`

You can enable `--harmony` option in two ways:

- Use `#! /usr/bin/env node --harmony` in the subcommands scripts. (Note Windows does not support this pattern.)
- Use the `--harmony` option when call the command, like `node --harmony examples/pm publish`. The `--harmony` option will be preserved when spawning subcommand process.

### Debugging stand-alone executable subcommands

An executable subcommand is launched as a separate child process.

If you are using the node inspector for [debugging](https://nodejs.org/en/docs/guides/debugging-getting-started/) executable subcommands using `node --inspect` et al,
the inspector port is incremented by 1 for the spawned subcommand.

If you are using VSCode to debug executable subcommands you need to set the `"autoAttachChildProcesses": true` flag in your launch.json configuration.

### Override exit and output handling

By default Commander calls `process.exit` when it detects errors, or after displaying the help or version. You can override
this behaviour and optionally supply a callback. The default override throws a `CommanderError`.

The override callback is passed a `CommanderError` with properties `exitCode` number, `code` string, and `message`. The default override behaviour is to throw the error, except for async handling of executable subcommand completion which carries on. The normal display of error messages or version or help
is not affected by the override which is called after the display.

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/exit-override.js) -->
<!-- The below code snippet is automatically added from ./examples/Readme/exit-override.js -->
```js
program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  // custom processing...
}
```
<!-- MARKDOWN-AUTO-DOCS:END -->

By default Commander is configured for a command-line application and writes to stdout and stderr.
You can modify this behaviour for custom applications. In addition, you can modify the display of error messages.

Example file: [configure-output.js](./examples/configure-output.js)


<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/configure-output.js) -->
<!-- The below code snippet is automatically added from ./examples/configure-output.js -->
```js
// const commander = require('commander'); // (normal include)
const commander = require('../'); // include commander in git clone of commander repo

const program = new commander.Command();

function errorColor(str) {
  // Add ANSI escape codes to display text in red.
  return `\x1b[31m${str}\x1b[0m`;
}

program
  .configureOutput({
    // Visibly override write routines as example!
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // Output errors in red.
    outputError: (str, write) => write(errorColor(str))
  });

program
  .version('1.2.3')
  .option('-c, --compress')
  .command('sub-command');

program.parse();

// Try the following:
//  node configure-output.js --version
//  node configure-output.js --unknown
//  node configure-output.js --help
//  node configure-output.js
```
<!-- MARKDOWN-AUTO-DOCS:END -->

### Additional documentation

There is more information available about:

- [deprecated](./docs/deprecated.md) features still supported for backwards compatibility
- [options taking varying arguments](./docs/options-taking-varying-arguments.md)

## Examples

In a single command program, you might not need an action handler.

Example file: [pizza](./examples/pizza)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/pizza) -->
<!-- The below code snippet is automatically added from ./examples/pizza -->
```
#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .description('An application for pizza ordering')
  .option('-p, --peppers', 'Add peppers')
  .option('-c, --cheese <type>', 'Add the specified type of cheese', 'marble')
  .option('-C, --no-cheese', 'You do not want any cheese');

program.parse();

const options = program.opts();
console.log('you ordered a pizza with:');
if (options.peppers) console.log('  - peppers');
const cheese = !options.cheese ? 'no' : options.cheese;
console.log('  - %s cheese', cheese);
```
<!-- MARKDOWN-AUTO-DOCS:END -->

In a multi-command program, you will have action handlers for each command (or stand-alone executables for the commands).

Example file: [deploy](./examples/deploy)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/deploy) -->
<!-- The below code snippet is automatically added from ./examples/deploy -->
```
#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .version('0.0.1')
  .option('-c, --config <path>', 'set config path', './deploy.conf');

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option('-s, --setup_mode <mode>', 'Which setup mode to use', 'normal')
  .action((env, options) => {
    env = env || 'all';
    console.log('read config from %s', program.opts().config);
    console.log('setup for %s env(s) with %s mode', env, options.setup_mode);
  });

program
  .command('exec <script>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option('-e, --exec_mode <mode>', 'Which exec mode to use', 'fast')
  .action((script, options) => {
    console.log('read config from %s', program.opts().config);
    console.log('exec "%s" using %s mode and config %s', script, options.exec_mode, program.opts().config);
  }).addHelpText('after', `
Examples:
  $ deploy exec sequential
  $ deploy exec async`
  );
  
program.parse(process.argv);
```
<!-- MARKDOWN-AUTO-DOCS:END -->

More samples can be found in the [examples](https://github.com/tj/commander.js/tree/master/examples) directory.

## Support

The current version of Commander is fully supported on Long Term Support versions of node, and requires at least node v12.
(For older versions of node, use an older version of Commander. Commander version 2.x has the widest support.)

The main forum for free and community support is the project [Issues](https://github.com/tj/commander.js/issues) on GitHub.

### Commander for enterprise

Available as part of the Tidelift Subscription

The maintainers of Commander and thousands of other packages are working with Tidelift to deliver commercial support and maintenance for the open source dependencies you use to build your applications. Save time, reduce risk, and improve code health, while paying the maintainers of the exact dependencies you use. [Learn more.](https://tidelift.com/subscription/pkg/npm-commander?utm_source=npm-commander&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)
