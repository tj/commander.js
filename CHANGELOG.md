# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD004 -->

## [14.0.2] (2025-10-25)

### Changed

- improve negative number auto-detection test ([#2428])
- update (dev) dependencies

## [14.0.1] (2025-09-12)

### Fixed

- broken markdown link in README ([#2369])

### Changed

- improve code readability by using optional chaining ([#2394])
- use more idiomatic code with object spread instead of `Object.assign()` ([#2395])
- improve code readability using `string.endsWith()` instead of `string.slice()` ([#2396])
- refactor `.parseOptions()` to process args array in-place ([#2409])
- change private variadic support routines from `._concatValue()` to `._collectValue()` (change code from `array.concat()` to `array.push()`) ([#2410])
- update (dev) dependencies

## [14.0.0] (2025-05-18)

### Added

- support for groups of options and commands in the help using low-level `.helpGroup()` on `Option` and `Command`, and higher-level `.optionsGroup()` and `.commandsGroup()` which can be used in chaining way to specify group title for following options/commands ([#2328])
- support for unescaped negative numbers as option-arguments and command-arguments ([#2339])
- TypeScript: add `parseArg` property to `Argument` class ([#2359])

### Fixed

- remove bogus leading space in help when option has default value but not a description ([#2348])
- `.configureOutput()` now makes copy of settings instead of modifying in-place, fixing side-effects ([#2350])

### Changed

- *Breaking:* Commander 14 requires Node.js v20 or higher
- internal refactor of `Help` class adding `.formatItemList()` and `.groupItems()` methods ([#2328])

## [13.1.0] (2025-01-21)

### Added

- support a pair of long option flags to allow a memorable shortened flag, like `.option('--ws, --workspace')` ([#2312])

## [13.0.0] (2024-12-30)

### Added

- support multiple calls to `.parse()` with default settings ([#2299])
- add `.saveStateBeforeParse()` and `.restoreStateBeforeParse()` for use by subclasses ([#2299])
- style routines like `styleTitle()` to add color to help using `.configureHelp()` or Help subclass ([#2251])
- color related support in `.configureOutput()` for `getOutHasColors()`, `getErrHasColors()`, and `stripColor()` ([#2251])
- Help property for `minWidthToWrap` ([#2251])
- Help methods for `displayWidth()`, `boxWrap()`, `preformatted()` et al ([#2251])

### Changed

- *Breaking*: excess command-arguments cause an error by default, see migration tips ([#2223])
- *Breaking*: throw during Option construction for unsupported option flags, like multiple characters after single `-` ([#2270])
  - note: support for dual long option flags added in Commander 13.1
- *Breaking*: throw on multiple calls to `.parse()` if `storeOptionsAsProperties: true` ([#2299])
- TypeScript: include implicit `this` in parameters for action handler callback ([#2197])

### Deleted

- *Breaking*: `Help.wrap()` refactored into `formatItem()` and `boxWrap()` ([#2251])

### Migration Tips

**Excess command-arguments**

It is now an error for the user to specify more command-arguments than are expected. (`allowExcessArguments` is now false by default.)

Old code:

```js
program.option('-p, --port <number>', 'port number');
program.action((options) => {
  console.log(program.args);
});
```

Now shows an error:

```console
$ node example.js a b c
error: too many arguments. Expected 0 arguments but got 3.
```

You can declare the expected arguments. The help will then be more accurate too. Note that declaring
new arguments will change what is passed to the action handler.

```js
program.option('-p, --port <number>', 'port number');
program.argument('[args...]', 'remote command and arguments'); // expecting zero or more arguments
program.action((args, options) => {
  console.log(args);
});
```

Or you could suppress the error, useful for minimising changes in legacy code.

```js
program.option('-p, --port', 'port number');
program.allowExcessArguments();
program.action((options) => {
  console.log(program.args);
});
```

**Stricter option flag parsing**

Commander now throws an error for option flag combinations that are not supported.
In particular, a short flag with multiple characters is now an error.

```js
program.option('-ws, --workspace'); // throws error
```

A short option has a single character:

```js
program.option('-w, --workspace');
```

Or from Commander 13.1 you can have an extra long flag instead of a short flag to allow a more memorable shortcut for the full name:

```js
program.option('--ws, --workspace');
```

## [13.0.0-0] (2024-12-07)

(Released in 13.0.0)

## [12.1.0] (2024-05-18)

### Added

- auto-detect special node flags `node --eval` and `node --print` when call `.parse()` with no arguments ([#2164])

### Changed

- prefix require of Node.js core modules with `node:` ([#2170])
- format source files with Prettier ([#2180])
- switch from StandardJS to directly calling ESLint for linting ([#2153])
- extend security support for previous major version of Commander ([#2150])

### Removed

- removed unimplemented Option.fullDescription from TypeScript definition ([#2191])

## [12.0.0] (2024-02-03)

### Added

- `.addHelpOption()` as another way of configuring built-in help option ([#2006])
- `.helpCommand()` for configuring built-in help command ([#2087])

### Fixed

- *Breaking:* use non-zero exit code when spawned executable subcommand terminates due to a signal ([#2023])
- *Breaking:* check `passThroughOptions` constraints when using `.addCommand` and throw if parent command does not have `.enablePositionalOptions()` enabled ([#1937])

### Changed

- *Breaking:* Commander 12 requires Node.js v18 or higher ([#2027])
- *Breaking:* throw an error if add an option with a flag which is already in use ([#2055])
- *Breaking:* throw an error if add a command with name or alias which is already in use ([#2059])
- *Breaking:* throw error when calling `.storeOptionsAsProperties()` after setting an option value ([#1928])
- replace non-standard JSDoc of `@api private` with documented `@private` ([#1949])
- `.addHelpCommand()` now takes a Command (passing string or boolean still works as before but deprecated) ([#2087])
- refactor internal implementation of built-in help option ([#2006])
- refactor internal implementation of built-in help command ([#2087])

### Deprecated

- `.addHelpCommand()` passing string or boolean (use `.helpCommand()` or pass a Command) ([#2087])

### Removed

- *Breaking:* removed default export of a global Command instance from CommonJS (use the named `program` export instead) ([#2017])

### Migration Tips

**global program**

If you are using the [deprecated](./docs/deprecated.md#default-import-of-global-command-object) default import of the global Command object, you need to switch to using a named import (or create a new `Command`).

```js
// const program = require('commander');
const { program } = require('commander');
```

**option and command clashes**

A couple of configuration problems now throw an error, which will pick up issues in existing programs:

- adding an option which uses the same flag as a previous option
- adding a command which uses the same name or alias as a previous command

## [12.0.0-1] (2024-01-20)

(Released in 12.0.0)

## [12.0.0-0] (2023-11-11)

(Released in 12.0.0)

## [11.1.0] (2023-10-13)

### Fixed

- TypeScript: update `OptionValueSource` to allow any string, to match supported use of custom sources ([#1983])
- TypeScript: add that `Command.version()` can also be used as getter ([#1982])
- TypeScript: add null return type to `Commands.executableDir()`, for when not configured ([#1965])
- subcommands with an executable handler and only a short help flag are now handled correctly by the parent's help command ([#1930])

### Added

- `registeredArguments` property on `Command` with the array of defined `Argument` (like `Command.options` for `Option`) ([#2010])
- TypeScript declarations for Option properties: `envVar`, `presetArg` ([#2019])
- TypeScript declarations for Argument properties: `argChoices`, `defaultValue`, `defaultValueDescription` ([#2019])
- example file which shows how to configure help to display any custom usage in the list of subcommands ([#1896])

### Changed

- (developer) refactor TypeScript configs for multiple use-cases, and enable checks in JavaScript files in supporting editors ([#1969])

### Deprecated

- `Command._args` was private anyway, but now available as `registeredArguments` ([#2010])

## [11.0.0] (2023-06-16)

### Fixed

- help command works when help option is disabled ([#1864])

### Changed

- leading and trailing spaces are now ignored by the .arguments() method ([#1874])
- refine "types" exports for ESM to follow TypeScript guidelines ([#1886])
- *Breaking:* Commander 11 requires Node.js v16 or higher

## [10.0.1] (2023-04-15)

### Added

- improvements to documentation ([#1858], [#1859], [#1860])

### Fixed

- remove unused `Option.optionFlags` property from TypeScript definition ([#1844])

### Changed

- assume boolean option intended if caller passes string instead of hash to `.implies()` ([#1854])

## [10.0.0] (2023-01-13)

### Added

- wrap command description in help ([#1804])

### Changed

- *Breaking:* Commander 10 requires Node.js v14 or higher

## [9.5.0] (2023-01-07)

### Added

- `.getOptionValueSourceWithGlobals()` ([#1832])
- `showGlobalOptions` for `.configureHelp{}` and `Help` ([#1828])

## [9.4.1] (2022-09-30)

### Fixed

- `.setOptionValue()` now also clears option source ([#1795])
- TypeScript: add `implied` to `OptionValueSource` for option values set by using `.implies()` ([#1794])
- TypeScript : add `undefined` to return type of `.getOptionValueSource()` ([#1794])

### Changed

- additions to README

## [9.4.0] (2022-07-15)

### Added

- `preSubcommand` hook called before direct subcommands ([#1763])

### Fixed

- export `InvalidOptionArgumentError` in esm ([#1756])

### Changed

- update dependencies ([#1767])

## [9.3.0] (2022-05-28)

### Added

- `.summary()` for a short summary to use instead of description when listing subcommands in help ([#1726])
- `Option.implies()` to set other option values when the option is specified ([#1724])
- updated Chinese README with 9.x changes ([#1727])

### Fixed

- TypeScript: add `string[]` to `.options()` default value parameter type for use with variadic options ([#1721])

### Deprecated

- multi-character short option flag (e.g. `-ws`) ([#1718])

## [9.2.0] (2022-04-15)

### Added

- conditional export of 'types' for upcoming TypeScript module resolution ([#1703])
- example file showing two ways to add global options to subcommands ([#1708])

### Fixed

- detect option conflicts in parent commands of called subcommand ([#1710])

### Changed

- replace deprecated `String.prototype.substr` ([#1706])

## [9.1.0] (2022-03-19)

### Added

- Option `.conflicts()` to set conflicting options which can not be specified together ([#1678])
- (developer) CodeQL configuration for GitHub Actions ([#1698])

## [9.0.0] (2022-01-28)

### Added

- simpler ECMAScript import ([#1589])
- Option.preset() allows specifying value/arg for option when used without option-argument (especially optional, but also boolean option) ([#1652])
- `.executableDir()` for custom search for subcommands ([#1571])
- throw with helpful message if pass `Option` to `.option()` or `.requiredOption()` ([#1655])
- .`error()` for generating errors from client code just like Commander generated errors, with support for  `.configureOutput()`, `.exitOverride()`, and `.showHelpAfterError()` ([#1675])
- `.optsWithGlobals()` to return merged local and global options ([#1671])

### Changed

- *Breaking:* Commander 9 requires Node.js v12.20.0 or higher
- update package-lock.json to lockfile@2 format ([#1659])
- `showSuggestionAfterError` is now on by default ([#1657])
- *Breaking:* default value specified for boolean option now always used as default value (see .preset() to match some previous behaviours) ([#1652])
- default value for boolean option only shown in help if true/false ([#1652])
- use command name as prefix for subcommand stand-alone executable name (with fallback to script name for backwards compatibility) ([#1571])
- allow absolute path with `executableFile` ([#1571])
- removed restriction that nested subcommands must specify `executableFile` ([#1571])
- TypeScript: allow passing readonly string array to `.choices()` ([#1667])
- TypeScript: allow passing readonly string array to `.parse()`, `.parseAsync()`, `.aliases()` ([#1669])

### Fixed

- option with optional argument not supplied on command line now works when option already has a value, whether from default value or from previous arguments ([#1652])

### Removed

- *Breaking:* removed internal fallback to `require.main.filename` when script not known from arguments passed to `.parse()` (can supply details using `.name()`, and `.executableDir()` or `executableFile`) ([#1571])

## [9.0.0-1] (2022-01-15)

(Released in 9.0.0)

## [9.0.0-0] (2021-12-22)

(Released in 9.0.0)

## [8.3.0] (2021-10-22)

### Added

- `.getOptionValueSource()` and `.setOptionValueWithSource()`, where expected values for source are one of 'default', 'env', 'config', 'cli' ([#1613])

### Deprecated

- `.command('*')`, use default command instead ([#1612])
- `on('command:*')`, use `.showSuggestionAfterError()` instead ([#1612])

## [8.2.0] (2021-09-10)

### Added

- `.showSuggestionAfterError()` to show suggestions after unknown command or unknown option ([#1590])
- add `Option` support for values from environment variables using `.env()` ([#1587])

### Changed

- show error for unknown global option before subcommand (rather than just help) ([#1590])

### Removed

- TypeScript declaration of unimplemented `Option` method `argumentRejected`

## [8.1.0] (2021-07-27)

### Added

- `.copyInheritedSettings()` ([#1557])
- update Chinese translations of documentation for Commander v8 ([#1570])
- `Argument` methods for `.argRequired()` and `.argOptional()` ([#1567])

## [8.0.0] (2021-06-25)

### Added

- `.argument(name, description)` for adding command-arguments ([#1490])
  - supports default value for optional command-arguments ([#1508])
  - supports custom processing function ([#1508])
- `.createArgument()` factory method ([#1497])
- `.addArgument()` ([#1490])
- `Argument` supports `.choices()` ([#1525])
- `.showHelpAfterError()` to display full help or a custom message after an error ([#1534])
- `.hook()` with support for `'preAction'` and `'postAction'` callbacks ([#1514])
- client typing of `.opts()` return type using TypeScript generics ([#1539])
- the number of command-arguments is checked for programs without an action handler ([#1502])
- `.getOptionValue()` and `.setOptionValue()` ([#1521])

### Changed

- refactor and simplify TypeScript declarations (with no default export) ([#1520])
- `.parseAsync()` is now declared as `async` ([#1513])
- *Breaking:* `Help` method `.visibleArguments()` returns array of `Argument` ([#1490])
- *Breaking:* Commander 8 requires Node.js 12 or higher ([#1500])
- *Breaking:* `CommanderError` code `commander.invalidOptionArgument` renamed `commander.invalidArgument` ([#1508])
- *Breaking:* TypeScript declaration for `.addTextHelp()` callback no longer allows result of `undefined`, now just `string` ([#1516])
- refactor `index.tab` into a file per class ([#1522])
- remove help suggestion from "unknown command" error message (see `.showHelpAfterError()`) ([#1534])
- `Command` property `.arg` initialised to empty array (was previously undefined) ([#1529])
- update dependencies

### Deprecated

- second parameter of `cmd.description(desc, argDescriptions)` for adding argument descriptions ([#1490])
  - (use new `.argument(name, description)` instead)
- `InvalidOptionArgumentError` (replaced by `InvalidArgumentError`) ([#1508])

### Removed

- *Breaking:* TypeScript declaration for default export of global `Command` object ([#1520])
  - (still available as named `program` export)

### Migration Tips

If you have a simple program without an action handler, you will now get an error if
there are missing command-arguments.

```js
program
  .option('-d, --debug')
  .arguments('<file>');
program.parse();
```

```sh
$ node trivial.js 
error: missing required argument 'file'
```

If you want to show the help in this situation, you could check the arguments before parsing:

```js
if (process.argv.length === 2)
  program.help();
program.parse();
```

Or, you might choose to show the help after any user error:

```js
program.showHelpAfterError();
```

## [8.0.0-2] (2021-06-06)

(Released in 8.0.0)

## [8.0.0-1] (2021-05-30)

(Released in 8.0.0)

## [8.0.0-0] (2021-05-23)

(Released in 8.0.0)

## [7.2.0] (2021-03-22)

### Added

- TypeScript typing for `parent` property on `Command` ([#1475])
- TypeScript typing for `.attributeName()` on `Option` ([#1483])
- support information in package ([#1477])

### Changed

- improvements to error messages, README, and tests
- update dependencies

## [7.1.0] (2021-02-15)

### Added

- support for named imports from ECMAScript modules ([#1440])
- add `.cjs` to list of expected script file extensions ([#1449])
- allow using option choices and variadic together ([#1454])

### Fixed

- replace use of deprecated `process.mainModule` ([#1448])
- regression for legacy `command('*')` and call when command line includes options ([#1464])
- regression for `on('command:*', ...)` and call when command line includes unknown options ([#1464])
- display best error for combination of unknown command and unknown option (i.e. unknown command) ([#1464])

### Changed

- make TypeScript typings tests stricter ([#1453])
- improvements to README and tests

## [7.0.0] (2021-01-15)

### Added

- `.enablePositionalOptions()` to let program and subcommand reuse same option ([#1427])
- `.passThroughOptions()` to pass options through to other programs without needing `--` ([#1427])
- `.allowExcessArguments(false)` to show an error message if there are too many command-arguments on command line for the action handler ([#1409])
- `.configureOutput()` to modify use of stdout and stderr or customise display of errors ([#1387])
- use `.addHelpText()` to add text before or after the built-in help, for just current command or also for all subcommands ([#1296])
- enhance Option class ([#1331])
  - allow hiding options from help
  - allow restricting option arguments to a list of choices
  - allow setting how default value is shown in help
- `.createOption()` to support subclassing of automatically created options (like `.createCommand()`) ([#1380])
- refactor the code generating the help into a separate public Help class ([#1365])
  - support sorting subcommands and options in help
  - support specifying wrap width (columns)
  - allow subclassing Help class
  - allow configuring Help class without subclassing

### Changed

- *Breaking:* options are stored safely by default, not as properties on the command ([#1409])
  - this especially affects accessing options on program, use `program.opts()`
  - revert behaviour with `.storeOptionsAsProperties()`
- *Breaking:* action handlers are passed options and command separately ([#1409])
- deprecated callback parameter to `.help()` and `.outputHelp()` (removed from README) ([#1296])
- *Breaking:* errors now displayed using `process.stderr.write()` instead of `console.error()`
- deprecate `.on('--help')` (removed from README) ([#1296])
- initialise the command description to empty string (previously undefined) ([#1365])
- document and annotate deprecated routines ([#1349])

### Fixed

- wrapping bugs in help ([#1365])
  - first line of command description was wrapping two characters early
  - pad width calculation was not including help option and help command
  - pad width calculation was including hidden options and commands
- improve backwards compatibility for custom command event listeners ([#1403])
  
### Deleted

- *Breaking:* `.passCommandToAction()` ([#1409])
  - no longer needed as action handler is passed options and command
- *Breaking:* "extra arguments" parameter to action handler ([#1409])
  - if being used to detect excess arguments, there is now an error available by setting `.allowExcessArguments(false)`

### Migration Tips

The biggest change is the parsed option values. Previously the options were stored by default as properties on the command object, and now the options are stored separately.

If you wish to restore the old behaviour and get running quickly you can call `.storeOptionsAsProperties()`.
To allow you to move to the new code patterns incrementally, the action handler will be passed the command _twice_,
to match the new "options" and "command" parameters (see below).

**program options**

Use the `.opts()` method to access the options. This is available on any command but is used most with the program.

```js
program.option('-d, --debug');
program.parse();
// Old code before Commander 7
if (program.debug) console.log(`Program name is ${program.name()}`);
```

```js
// New code
const options = program.opts();
if (options.debug) console.log(`Program name is ${program.name()}`);
```

**action handler**

The action handler gets passed a parameter for each command-argument you declared. Previously by default the next parameter was the command object with the options as properties. Now the next two parameters are instead the options and the command. If you
only accessed the options there may be no code changes required.

```js
program
  .command('compress <filename>')
  .option('-t, --trace')
  // Old code before Commander 7
  .action((filename, cmd) => {
    if (cmd.trace) console.log(`Command name is ${cmd.name()}`);
  });
```

```js
  // New code
  .action((filename, options, command) => {
    if (options.trace) console.log(`Command name is ${command.name()}`);
  });
```

If you already set `.storeOptionsAsProperties(false)` you may still need to adjust your code.

```js
program
  .command('compress <filename>')
  .storeOptionsAsProperties(false)
  .option('-t, --trace')
  // Old code before Commander 7
  .action((filename, command) => {
    if (command.opts().trace) console.log(`Command name is ${command.name()}`);
  });
```

```js
   // New code
   .action((filename, options, command) => {
      if (command.opts().trace) console.log(`Command name is ${command.name()}`);
   });
```

## [7.0.0-2] (2020-12-14)

(Released in 7.0.0)

## [7.0.0-1] (2020-11-21)

(Released in 7.0.0)

## [7.0.0-0] (2020-10-25)

(Released in 7.0.0)

## [6.2.1] (2020-12-13)

### Fixed

- some tests failed if directory path included a space ([#1390])

## [6.2.0] (2020-10-25)

### Added

- added 'tsx' file extension for stand-alone executable subcommands ([#1368])
- documented second parameter to `.description()` to describe command arguments ([#1353])
- documentation of special cases with options taking varying numbers of option-arguments ([#1332])
- documentation for terminology ([#1361])
  
### Fixed

- add missing TypeScript definition for `.addHelpCommand()' ([#1375])
- removed blank line after "Arguments:" in help, to match "Options:" and "Commands:" ([#1360])

### Changed

- update dependencies

## [6.1.0] (2020-08-28)

### Added

- include URL to relevant section of README for error for potential conflict between Command properties and option values ([#1306])
- `.combineFlagAndOptionalValue(false)` to ease upgrade path from older versions of Commander ([#1326])
- allow disabling the built-in help option using `.helpOption(false)` ([#1325])
- allow just some arguments in `argumentDescription` to `.description()` ([#1323])

### Changed

- tidy async test and remove lint override ([#1312])

### Fixed

- executable subcommand launching when script path not known ([#1322])

## [6.0.0] (2020-07-21)

### Added

- add support for variadic options ([#1250])
- allow options to be added with just a short flag ([#1256])
  - *Breaking* the option property has same case as flag. e.g. flag `-n` accessed as `opts().n` (previously uppercase)
- *Breaking* throw an error if there might be a clash between option name and a Command property, with advice on how to resolve ([#1275])

### Fixed

- Options which contain -no- in the middle of the option flag should not be treated as negatable. ([#1301])

## [6.0.0-0] (2020-06-20)

(Released in 6.0.0)

## [5.1.0] (2020-04-25)

### Added

- support for multiple command aliases, the first of which is shown in the auto-generated help ([#531], [#1236])
- configuration support in `addCommand()` for `hidden` and `isDefault` ([#1232])

### Fixed

- omit masked help flags from the displayed help ([#645], [#1247])
- remove old short help flag when change help flags using `helpOption` ([#1248])

### Changed

- remove use of `arguments` to improve auto-generated help in editors ([#1235])
- rename `.command()` configuration `noHelp` to `hidden` (but not remove old support) ([#1232])
- improvements to documentation
- update dependencies
- update tested versions of node
- eliminate lint errors in TypeScript ([#1208])

## [5.0.0] (2020-03-14)

### Added

* support for nested commands with action-handlers ([#1] [#764] [#1149])
* `.addCommand()` for adding a separately configured command ([#764] [#1149])
* allow a non-executable to be set as the default command ([#742] [#1149])
* implicit help command when there are subcommands (previously only if executables) ([#1149])
* customise implicit help command with `.addHelpCommand()` ([#1149])
* display error message for unknown subcommand, by default ([#432] [#1088] [#1149])
* display help for missing subcommand, by default ([#1088] [#1149])
* combined short options as single argument may include boolean flags and value flag and value (e.g. `-a -b -p 80` can be written as `-abp80`) ([#1145])
* `.parseOption()` includes short flag and long flag expansions ([#1145])
* `.helpInformation()` returns help text as a string, previously a private routine ([#1169])
* `.parse()` implicitly uses `process.argv` if arguments not specified ([#1172])
* optionally specify where `.parse()` arguments "from", if not following node conventions ([#512] [#1172])
* suggest help option along with unknown command error ([#1179])
* TypeScript definition for `commands` property of `Command` ([#1184])
* export `program` property ([#1195])
* `createCommand` factory method to simplify subclassing ([#1191])

### Fixed

* preserve argument order in subcommands ([#508] [#962] [#1138])
* do not emit `command:*` for executable subcommands ([#809] [#1149])
* action handler called whether or not there are non-option arguments ([#1062] [#1149])
* combining option short flag and value in single argument now works for subcommands ([#1145])
* only add implicit help command when it will not conflict with other uses of argument ([#1153] [#1149])
* implicit help command works with command aliases ([#948] [#1149])
* options are validated whether or not there is an action handler ([#1149])

### Changed

* *Breaking* `.args` contains command arguments with just recognised options removed ([#1032] [#1138])
* *Breaking* display error if required argument for command is missing ([#995] [#1149])
* tighten TypeScript definition of custom option processing function passed to `.option()` ([#1119])
* *Breaking* `.allowUnknownOption()` ([#802] [#1138])
  * unknown options included in arguments passed to command action handler
  * unknown options included in `.args`
* only recognised option short flags and long flags are expanded (e.g. `-ab` or `--foo=bar`) ([#1145])
* *Breaking* `.parseOptions()` ([#1138])
  * `args` in returned result renamed `operands` and does not include anything after first unknown option
  * `unknown` in returned result has arguments after first unknown option including operands, not just options and values
* *Breaking* `.on('command:*', callback)` and other command events passed (changed) results from `.parseOptions`, i.e. operands and unknown  ([#1138])
* refactor Option from prototype to class ([#1133])
* refactor Command from prototype to class ([#1159])
* changes to error handling ([#1165])
  * throw for author error, not just display message
  * preflight for variadic error
  * add tips to missing subcommand executable
* TypeScript fluent return types changed to be more subclass friendly, return `this` rather than `Command` ([#1180])
* `.parseAsync` returns `Promise<this>` to be consistent with `.parse()` ([#1180])
* update dependencies

### Removed

* removed EventEmitter from TypeScript definition for Command, eliminating implicit peer dependency on `@types/node` ([#1146])
* removed private function `normalize` (the functionality has been integrated into `parseOptions`) ([#1145])
* `parseExpectedArgs` is now private ([#1149])

### Migration Tips

If you use `.on('command:*')` or more complicated tests to detect an unrecognised subcommand, you may be able to delete the code and rely on the default behaviour.

If you use `program.args` or more complicated tests to detect a missing subcommand, you may be able to delete the code and rely on the default behaviour.

If you use `.command('*')` to add a default command, you may be be able to switch to `isDefault:true` with a named command.

If you want to continue combining short options with optional values as though they were boolean flags, set `combineFlagAndOptionalValue(false)`
to expand `-fb` to `-f -b` rather than `-f b`.

## [5.0.0-4] (2020-03-03)

(Released in 5.0.0)

## [5.0.0-3] (2020-02-20)

(Released in 5.0.0)

## [5.0.0-2] (2020-02-10)

(Released in 5.0.0)

## [5.0.0-1] (2020-02-08)

(Released in 5.0.0)

## [5.0.0-0] (2020-02-02)

(Released in 5.0.0)

## [4.1.1] (2020-02-02)

### Fixed

* TypeScript definition for `.action()` should include Promise for async ([#1157])

## [4.1.0] (2020-01-06)

### Added

* two routines to change how option values are handled, and eliminate name clashes with command properties ([#933] [#1102])
  * see storeOptionsAsProperties and passCommandToAction in README
* `.parseAsync` to use instead of `.parse` if supply async action handlers ([#806] [#1118])

### Fixed

* Remove trailing blanks from wrapped help text ([#1096])

### Changed

* update dependencies
* extend security coverage for Commander 2.x to 2020-02-03
* improvements to README
* improvements to TypeScript definition documentation
* move old versions out of main CHANGELOG
* removed explicit use of `ts-node` in tests

## [4.0.1] (2019-11-12)

### Fixed

* display help when requested, even if there are missing required options ([#1091])

## [4.0.0] (2019-11-02)

### Added

* automatically wrap and indent help descriptions for options and commands ([#1051])
* `.exitOverride()` allows override of calls to `process.exit` for additional error handling and to keep program running ([#1040])
* support for declaring required options with `.requiredOptions()` ([#1071])
* GitHub Actions support ([#1027])
* translation links in README

### Changed

* dev: switch tests from Sinon+Should to Jest with major rewrite of tests ([#1035])
* call default subcommand even when there are unknown options ([#1047])
* *Breaking* Commander is only officially supported on Node 8 and above, and requires Node 6 ([#1053])

### Fixed

* *Breaking* keep command object out of program.args when action handler called ([#1048])
  * also, action handler now passed array of unknown arguments
* complain about unknown options when program argument supplied and action handler ([#1049])
  * this changes parameters to `command:*` event to include unknown arguments
* removed deprecated `customFds` option from call to `child_process.spawn` ([#1052])
* rework TypeScript declarations to bring all types into imported namespace ([#1081])

### Migration Tips

#### Testing for no arguments

If you were previously using code like:

```js
if (!program.args.length) ...
```

a partial replacement is:

```js
if (program.rawArgs.length < 3) ...
```

## [4.0.0-1] Prerelease (2019-10-08)

(Released in 4.0.0)

## [4.0.0-0] Prerelease (2019-10-01)

(Released in 4.0.0)

## [3.0.2] (2019-09-27)

<!-- markdownlint-disable MD024 -->

### Fixed

* Improve tracking of executable subcommands.

### Changed

* update development dependencies

## [3.0.1] (2019-08-30)

### Added

* .name and .usage to README ([#1010])
* Table of Contents to README ([#1010])
* TypeScript definition for `executableFile` in CommandOptions ([#1028])

### Changed

* consistently use `const` rather than `var` in README ([#1026])

### Fixed

* help for sub commands with custom executableFile ([#1018])

## [3.0.0] / 2019-08-08

* Add option to specify executable file name ([#999])
  * e.g. `.command('clone', 'clone description', { executableFile: 'myClone' })`
* Change docs for `.command` to contrast action handler vs git-style executable. ([#938] [#990])
* **Breaking** Change TypeScript to use overloaded function for `.command`. ([#938] [#990])
* Change to use straight quotes around strings in error messages (like 'this' instead of `this') ([#915])
* Add TypeScript "reference types" for node ([#974])
* Add support for hyphen as an option argument in subcommands ([#697])
* Add support for a short option flag and its value to be concatenated for action handler subcommands ([#599])
  * e.g. `-p 80` can also be supplied as `-p80`
* Add executable arguments to spawn in win32, for git-style executables ([#611])
  * e.g. `node --harmony myCommand.js clone`
* Add parent command as prefix of subcommand in help ([#980])
* Add optional custom description to `.version` ([#963])
  * e.g. `program.version('0.0.1', '-v, --vers', 'output the current version')`
* Add `.helpOption(flags, description)` routine to customise help flags and description ([#963])
  * e.g. `.helpOption('-e, --HELP', 'read more information')`
* Fix behavior of --no-* options ([#795])
  * can now define both `--foo` and `--no-foo`
  * **Breaking** custom event listeners: `--no-foo` on cli now emits `option:no-foo` (previously `option:foo`)
  * **Breaking** default value: defining `--no-foo` after defining `--foo` leaves the default value unchanged (previously set it to false)
  * allow boolean default value, such as from environment ([#987])
* Increment inspector port for spawned subcommands ([#991])
  * e.g. `node --inspect myCommand.js clone`

### Migration Tips

The custom event for a negated option like `--no-foo` is `option:no-foo` (previously `option:foo`).

```js
program
  .option('--no-foo')
  .on('option:no-foo', () => {
    console.log('removing foo');
  });
```

When using TypeScript, adding a command does not allow an explicit `undefined` for an unwanted executable description (e.g
for a command with an action handler).

```js
program
  .command('action1', undefined, { noHelp: true }) // No longer valid
  .command('action2', { noHelp: true }) // Correct
```

## 3.0.0-0 Prerelease / 2019-07-28

(Released as 3.0.0)

## [2.20.1] (2019-09-29)

### Fixed

* Improve tracking of executable subcommands.

### Changed

* update development dependencies

## 2.20.0 / 2019-04-02

* fix: resolve symbolic links completely when hunting for subcommands (#935)
* Update index.d.ts (#930)
* Update Readme.md (#924)
* Remove --save option as it isn't required anymore (#918)
* Add link to the license file (#900)
* Added example of receiving args from options (#858)
* Added missing semicolon (#882)
* Add extension to .eslintrc (#876)

## 2.19.0 / 2018-10-02

* Removed newline after Options and Commands headers (#864)
* Bugfix - Error output (#862)
* Fix to change default value to string (#856)

## 2.18.0 / 2018-09-07

* Standardize help output (#853)
* chmod 644 travis.yml (#851)
* add support for execute typescript subcommand via ts-node (#849)

## 2.17.1 / 2018-08-07

* Fix bug in command emit (#844)

## 2.17.0 / 2018-08-03

* fixed newline output after help information (#833)
* Fix to emit the action even without command (#778)
* npm update (#823)

## 2.16.0 / 2018-06-29

* Remove Makefile and `test/run` (#821)
* Make 'npm test' run on Windows (#820)
* Add badge to display install size (#807)
* chore: cache node_modules (#814)
* chore: remove Node.js 4 (EOL), add Node.js 10 (#813)
* fixed typo in readme (#812)
* Fix types (#804)
* Update eslint to resolve vulnerabilities in lodash (#799)
* updated readme with custom event listeners. (#791)
* fix tests (#794)

## 2.15.0 / 2018-03-07

* Update downloads badge to point to graph of downloads over time instead of duplicating link to npm
* Arguments description

## 2.14.1 / 2018-02-07

* Fix typing of help function

## 2.14.0 / 2018-02-05

* only register the option:version event once
* Fixes issue #727: Passing empty string for option on command is set to undefined
* enable eqeqeq rule
* resolves #754 add linter configuration to project
* resolves #560 respect custom name for version option
* document how to override the version flag
* document using options per command

## 2.13.0 / 2018-01-09

* Do not print default for --no-
* remove trailing spaces in command help
* Update CI's Node.js to LTS and latest version
* typedefs: Command and Option types added to commander namespace

## 2.12.2 / 2017-11-28

* fix: typings are not shipped

## 2.12.1 / 2017-11-23

* Move @types/node to dev dependency

## 2.12.0 / 2017-11-22

* add attributeName() method to Option objects
* Documentation updated for options with --no prefix
* typings: `outputHelp` takes a string as the first parameter
* typings: use overloads
* feat(typings): update to match js api
* Print default value in option help
* Fix translation error
* Fail when using same command and alias (#491)
* feat(typings): add help callback
* fix bug when description is add after command with options (#662)
* Format js code
* Rename History.md to CHANGELOG.md (#668)
* feat(typings): add typings to support TypeScript (#646)
* use current node

## 2.11.0 / 2017-07-03

* Fix help section order and padding (#652)
* feature: support for signals to subcommands (#632)
* Fixed #37, --help should not display first (#447)
* Fix translation errors. (#570)
* Add package-lock.json
* Remove engines
* Upgrade package version
* Prefix events to prevent conflicts between commands and options (#494)
* Removing dependency on graceful-readlink
* Support setting name in #name function and make it chainable
* Add .vscode directory to .gitignore (Visual Studio Code metadata)
* Updated link to ruby commander in readme files

## 2.10.0 / 2017-06-19

* Update .travis.yml. drop support for older node.js versions.
* Fix require arguments in README.md
* On SemVer you do not start from 0.0.1
* Add missing semi colon in readme
* Add save param to npm install
* node v6 travis test
* Update Readme_zh-CN.md
* Allow literal '--' to be passed-through as an argument
* Test subcommand alias help
* link build badge to master branch
* Support the alias of Git style sub-command
* added keyword commander for better search result on npm
* Fix Sub-Subcommands
* test node.js stable
* Fixes TypeError when a command has an option called `--description`
* Update README.md to make it beginner friendly and elaborate on the difference between angled and square brackets.
* Add chinese Readme file

## 2.9.0 / 2015-10-13

* Add option `isDefault` to set default subcommand #415 @Qix-
* Add callback to allow filtering or post-processing of help text #434 @djulien
* Fix `undefined` text in help information close #414 #416 @zhiyelee

## 2.8.1 / 2015-04-22

* Back out `support multiline description` Close #396 #397

## 2.8.0 / 2015-04-07

* Add `process.execArg` support, execution args like `--harmony` will be passed to sub-commands #387 @DigitalIO @zhiyelee
* Fix bug in Git-style sub-commands #372 @zhiyelee
* Allow commands to be hidden from help #383 @tonylukasavage
* When git-style sub-commands are in use, yet none are called, display help #382 @claylo
* Add ability to specify arguments syntax for top-level command #258 @rrthomas
* Support multiline descriptions #208 @zxqfox

## 2.7.1 / 2015-03-11

* Revert #347 (fix collisions when option and first arg have same name) which causes a bug in #367.

## 2.7.0 / 2015-03-09

* Fix git-style bug when installed globally. Close #335 #349 @zhiyelee
* Fix collisions when option and first arg have same name. Close #346 #347 @tonylukasavage
* Add support for camelCase on `opts()`. Close #353  @nkzawa
* Add node.js 0.12 and io.js to travis.yml
* Allow RegEx options. #337 @palanik
* Fixes exit code when sub-command failing.  Close #260 #332 @pirelenito
* git-style `bin` files in $PATH make sense. Close #196 #327  @zhiyelee

## 2.6.0 / 2014-12-30

* added `Command#allowUnknownOption` method. Close #138 #318 @doozr @zhiyelee
* Add application description to the help msg. Close #112 @dalssoft

## 2.5.1 / 2014-12-15

* fixed two bugs incurred by variadic arguments. Close #291 @Quentin01 #302 @zhiyelee

## 2.5.0 / 2014-10-24

* add support for variadic arguments. Closes #277 @whitlockjc

## 2.4.0 / 2014-10-17

* fixed a bug on executing the coercion function of subcommands option. Closes #270
* added `Command.prototype.name` to retrieve command name. Closes #264 #266 @tonylukasavage
* added `Command.prototype.opts` to retrieve all the options as a simple object of key-value pairs. Closes #262 @tonylukasavage
* fixed a bug on subcommand name. Closes #248 @jonathandelgado
* fixed function normalize doesn’t honor option terminator. Closes #216 @abbr

## 2.3.0 / 2014-07-16

* add command alias'. Closes PR #210
* fix: Typos. Closes #99
* fix: Unused fs module. Closes #217

## 2.2.0 / 2014-03-29

* add passing of previous option value
* fix: support subcommands on windows. Closes #142
* Now the defaultValue passed as the second argument of the coercion function.

## 2.1.0 / 2013-11-21

* add: allow cflag style option params, unit test, fixes #174

## 2.0.0 / 2013-07-18

* remove input methods (.prompt, .confirm, etc)

## 0.6.1 / 2012-06-01

* Added: append (yes or no) on confirmation
* Added: allow node.js v0.7.x

## 0.6.0 / 2012-04-10

* Added `.prompt(obj, callback)` support. Closes #49
* Added default support to .choose(). Closes #41
* Fixed the choice example

## 0.5.1 / 2011-12-20

* Fixed `password()` for recent nodes. Closes #36

## 0.5.0 / 2011-12-04

* Added sub-command option support [itay]

## 0.4.3 / 2011-12-04

* Fixed custom help ordering. Closes #32

## 0.4.2 / 2011-11-24

* Added travis support
* Fixed: line-buffered input automatically trimmed. Closes #31

## 0.4.1 / 2011-11-18

* Removed listening for "close" on --help

## 0.4.0 / 2011-11-15

* Added support for `--`. Closes #24

## 0.3.3 / 2011-11-14

* Fixed: wait for close event when writing help info [Jerry Hamlet]

## 0.3.2 / 2011-11-01

* Fixed long flag definitions with values [felixge]

## 0.3.1 / 2011-10-31

* Changed `--version` short flag to `-V` from `-v`
* Changed `.version()` so it's configurable [felixge]

## 0.3.0 / 2011-10-31

* Added support for long flags only. Closes #18

## 0.2.1 / 2011-10-24

* "node": ">= 0.4.x < 0.7.0". Closes #20

## 0.2.0 / 2011-09-26

* Allow for defaults that are not just boolean. Default reassignment only occurs for --no-*, optional, and required arguments. [Jim Isaacs]

## 0.1.0 / 2011-08-24

* Added support for custom `--help` output

## 0.0.5 / 2011-08-18

* Changed: when the user enters nothing prompt for password again
* Fixed issue with passwords beginning with numbers [NuckChorris]

## 0.0.4 / 2011-08-15

* Fixed `Commander#args`

## 0.0.3 / 2011-08-15

* Added default option value support

## 0.0.2 / 2011-08-15

* Added mask support to `Command#password(str[, mask], fn)`
* Added `Command#password(str, fn)`

## 0.0.1 / 2010-01-03

* Initial release

<!-- markdown reference links -->

[#948]: https://github.com/tj/commander.js/issues/948
[#1032]: https://github.com/tj/commander.js/issues/1032
[#1250]: https://github.com/tj/commander.js/pull/1250
[#1256]: https://github.com/tj/commander.js/pull/1256
[#1275]: https://github.com/tj/commander.js/pull/1275
[#1296]: https://github.com/tj/commander.js/pull/1296
[#1301]: https://github.com/tj/commander.js/issues/1301
[#1306]: https://github.com/tj/commander.js/pull/1306
[#1312]: https://github.com/tj/commander.js/pull/1312
[#1322]: https://github.com/tj/commander.js/pull/1322
[#1323]: https://github.com/tj/commander.js/pull/1323
[#1325]: https://github.com/tj/commander.js/pull/1325
[#1326]: https://github.com/tj/commander.js/pull/1326
[#1331]: https://github.com/tj/commander.js/pull/1331
[#1332]: https://github.com/tj/commander.js/pull/1332
[#1349]: https://github.com/tj/commander.js/pull/1349
[#1353]: https://github.com/tj/commander.js/pull/1353
[#1360]: https://github.com/tj/commander.js/pull/1360
[#1361]: https://github.com/tj/commander.js/pull/1361
[#1365]: https://github.com/tj/commander.js/pull/1365
[#1368]: https://github.com/tj/commander.js/pull/1368
[#1375]: https://github.com/tj/commander.js/pull/1375
[#1380]: https://github.com/tj/commander.js/pull/1380
[#1387]: https://github.com/tj/commander.js/pull/1387
[#1390]: https://github.com/tj/commander.js/pull/1390
[#1403]: https://github.com/tj/commander.js/pull/1403
[#1409]: https://github.com/tj/commander.js/pull/1409
[#1427]: https://github.com/tj/commander.js/pull/1427
[#1440]: https://github.com/tj/commander.js/pull/1440
[#1448]: https://github.com/tj/commander.js/pull/1448
[#1449]: https://github.com/tj/commander.js/pull/1449
[#1453]: https://github.com/tj/commander.js/pull/1453
[#1454]: https://github.com/tj/commander.js/pull/1454
[#1464]: https://github.com/tj/commander.js/pull/1464
[#1475]: https://github.com/tj/commander.js/pull/1475
[#1477]: https://github.com/tj/commander.js/pull/1477
[#1483]: https://github.com/tj/commander.js/pull/1483
[#1490]: https://github.com/tj/commander.js/pull/1490
[#1497]: https://github.com/tj/commander.js/pull/1497
[#1500]: https://github.com/tj/commander.js/pull/1500
[#1502]: https://github.com/tj/commander.js/pull/1502
[#1508]: https://github.com/tj/commander.js/pull/1508
[#1513]: https://github.com/tj/commander.js/pull/1513
[#1514]: https://github.com/tj/commander.js/pull/1514
[#1516]: https://github.com/tj/commander.js/pull/1516
[#1520]: https://github.com/tj/commander.js/pull/1520
[#1521]: https://github.com/tj/commander.js/pull/1521
[#1522]: https://github.com/tj/commander.js/pull/1522
[#1525]: https://github.com/tj/commander.js/pull/1525
[#1529]: https://github.com/tj/commander.js/pull/1529
[#1534]: https://github.com/tj/commander.js/pull/1534
[#1539]: https://github.com/tj/commander.js/pull/1539
[#1557]: https://github.com/tj/commander.js/pull/1557
[#1567]: https://github.com/tj/commander.js/pull/1567
[#1570]: https://github.com/tj/commander.js/pull/1570
[#1571]: https://github.com/tj/commander.js/pull/1571
[#1587]: https://github.com/tj/commander.js/pull/1587
[#1589]: https://github.com/tj/commander.js/pull/1589
[#1590]: https://github.com/tj/commander.js/pull/1590
[#1612]: https://github.com/tj/commander.js/pull/1612
[#1613]: https://github.com/tj/commander.js/pull/1613
[#1652]: https://github.com/tj/commander.js/pull/1652
[#1655]: https://github.com/tj/commander.js/pull/1655
[#1657]: https://github.com/tj/commander.js/pull/1657
[#1659]: https://github.com/tj/commander.js/pull/1659
[#1667]: https://github.com/tj/commander.js/pull/1667
[#1669]: https://github.com/tj/commander.js/pull/1669
[#1671]: https://github.com/tj/commander.js/pull/1671
[#1675]: https://github.com/tj/commander.js/pull/1675
[#1678]: https://github.com/tj/commander.js/pull/1678
[#1698]: https://github.com/tj/commander.js/pull/1698
[#1703]: https://github.com/tj/commander.js/pull/1703
[#1706]: https://github.com/tj/commander.js/pull/1706
[#1708]: https://github.com/tj/commander.js/pull/1708
[#1710]: https://github.com/tj/commander.js/pull/1710
[#1718]: https://github.com/tj/commander.js/pull/1718
[#1721]: https://github.com/tj/commander.js/pull/1721
[#1724]: https://github.com/tj/commander.js/pull/1724
[#1726]: https://github.com/tj/commander.js/pull/1726
[#1727]: https://github.com/tj/commander.js/pull/1727
[#1756]: https://github.com/tj/commander.js/pull/1756
[#1763]: https://github.com/tj/commander.js/pull/1763
[#1767]: https://github.com/tj/commander.js/pull/1767
[#1794]: https://github.com/tj/commander.js/pull/1794
[#1795]: https://github.com/tj/commander.js/pull/1795
[#1804]: https://github.com/tj/commander.js/pull/1804
[#1832]: https://github.com/tj/commander.js/pull/1832
[#1828]: https://github.com/tj/commander.js/pull/1828
[#1844]: https://github.com/tj/commander.js/pull/1844
[#1854]: https://github.com/tj/commander.js/pull/1854
[#1858]: https://github.com/tj/commander.js/pull/1858
[#1859]: https://github.com/tj/commander.js/pull/1859
[#1860]: https://github.com/tj/commander.js/pull/1860
[#1864]: https://github.com/tj/commander.js/pull/1864
[#1874]: https://github.com/tj/commander.js/pull/1874
[#1886]: https://github.com/tj/commander.js/pull/1886
[#1896]: https://github.com/tj/commander.js/pull/1896
[#1928]: https://github.com/tj/commander.js/pull/1928
[#1930]: https://github.com/tj/commander.js/pull/1930
[#1937]: https://github.com/tj/commander.js/pull/1937
[#1949]: https://github.com/tj/commander.js/pull/1949
[#1965]: https://github.com/tj/commander.js/pull/1965
[#1969]: https://github.com/tj/commander.js/pull/1969
[#1982]: https://github.com/tj/commander.js/pull/1982
[#1983]: https://github.com/tj/commander.js/pull/1983
[#2006]: https://github.com/tj/commander.js/pull/2006
[#2010]: https://github.com/tj/commander.js/pull/2010
[#2017]: https://github.com/tj/commander.js/pull/2017
[#2019]: https://github.com/tj/commander.js/pull/2019
[#2023]: https://github.com/tj/commander.js/pull/2023
[#2027]: https://github.com/tj/commander.js/pull/2027
[#2055]: https://github.com/tj/commander.js/pull/2055
[#2059]: https://github.com/tj/commander.js/pull/2059
[#2087]: https://github.com/tj/commander.js/pull/2087
[#2150]: https://github.com/tj/commander.js/pull/2150
[#2153]: https://github.com/tj/commander.js/pull/2153
[#2164]: https://github.com/tj/commander.js/pull/2164
[#2170]: https://github.com/tj/commander.js/pull/2170
[#2180]: https://github.com/tj/commander.js/pull/2180
[#2191]: https://github.com/tj/commander.js/pull/2191
[#2197]: https://github.com/tj/commander.js/pull/2197
[#2223]: https://github.com/tj/commander.js/pull/2223
[#2251]: https://github.com/tj/commander.js/pull/2251
[#2270]: https://github.com/tj/commander.js/pull/2270
[#2299]: https://github.com/tj/commander.js/pull/2299
[#2312]: https://github.com/tj/commander.js/pull/2312
[#2328]: https://github.com/tj/commander.js/pull/2328
[#2339]: https://github.com/tj/commander.js/pull/2339
[#2348]: https://github.com/tj/commander.js/pull/2348
[#2350]: https://github.com/tj/commander.js/pull/2350
[#2359]: https://github.com/tj/commander.js/pull/2359
[#2369]: https://github.com/tj/commander.js/pull/2369
[#2394]: https://github.com/tj/commander.js/pull/2394
[#2395]: https://github.com/tj/commander.js/pull/2395
[#2396]: https://github.com/tj/commander.js/pull/2396
[#2409]: https://github.com/tj/commander.js/pull/2409
[#2410]: https://github.com/tj/commander.js/pull/2410
[#2428]: https://github.com/tj/commander.js/pull/2428

<!-- Referenced in 5.x -->
[#1]: https://github.com/tj/commander.js/issues/1
[#432]: https://github.com/tj/commander.js/issues/432
[#508]: https://github.com/tj/commander.js/issues/508
[#512]: https://github.com/tj/commander.js/issues/512
[#531]: https://github.com/tj/commander.js/issues/531
[#645]: https://github.com/tj/commander.js/issues/645
[#742]: https://github.com/tj/commander.js/issues/742
[#764]: https://github.com/tj/commander.js/issues/764
[#802]: https://github.com/tj/commander.js/issues/802
[#809]: https://github.com/tj/commander.js/issues/809
[#962]: https://github.com/tj/commander.js/issues/962
[#995]: https://github.com/tj/commander.js/issues/995
[#1062]: https://github.com/tj/commander.js/pull/1062
[#1088]: https://github.com/tj/commander.js/issues/1088
[#1119]: https://github.com/tj/commander.js/pull/1119
[#1133]: https://github.com/tj/commander.js/pull/1133
[#1138]: https://github.com/tj/commander.js/pull/1138
[#1145]: https://github.com/tj/commander.js/pull/1145
[#1146]: https://github.com/tj/commander.js/pull/1146
[#1149]: https://github.com/tj/commander.js/pull/1149
[#1153]: https://github.com/tj/commander.js/issues/1153
[#1159]: https://github.com/tj/commander.js/pull/1159
[#1165]: https://github.com/tj/commander.js/pull/1165
[#1169]: https://github.com/tj/commander.js/pull/1169
[#1172]: https://github.com/tj/commander.js/pull/1172
[#1179]: https://github.com/tj/commander.js/pull/1179
[#1180]: https://github.com/tj/commander.js/pull/1180
[#1184]: https://github.com/tj/commander.js/pull/1184
[#1191]: https://github.com/tj/commander.js/pull/1191
[#1195]: https://github.com/tj/commander.js/pull/1195
[#1208]: https://github.com/tj/commander.js/pull/1208
[#1232]: https://github.com/tj/commander.js/pull/1232
[#1235]: https://github.com/tj/commander.js/pull/1235
[#1236]: https://github.com/tj/commander.js/pull/1236
[#1247]: https://github.com/tj/commander.js/pull/1247
[#1248]: https://github.com/tj/commander.js/pull/1248

<!-- Referenced in 4.x -->
[#933]: https://github.com/tj/commander.js/pull/933
[#1027]: https://github.com/tj/commander.js/pull/1027
[#1035]: https://github.com/tj/commander.js/pull/1035
[#1040]: https://github.com/tj/commander.js/pull/1040
[#1047]: https://github.com/tj/commander.js/pull/1047
[#1048]: https://github.com/tj/commander.js/pull/1048
[#1049]: https://github.com/tj/commander.js/pull/1049
[#1051]: https://github.com/tj/commander.js/pull/1051
[#1052]: https://github.com/tj/commander.js/pull/1052
[#1053]: https://github.com/tj/commander.js/pull/1053
[#1071]: https://github.com/tj/commander.js/pull/1071
[#1081]: https://github.com/tj/commander.js/pull/1081
[#1091]: https://github.com/tj/commander.js/pull/1091
[#1096]: https://github.com/tj/commander.js/pull/1096
[#1102]: https://github.com/tj/commander.js/pull/1102
[#1118]: https://github.com/tj/commander.js/pull/1118
[#1157]: https://github.com/tj/commander.js/pull/1157
[#806]: https://github.com/tj/commander.js/issues/806

<!-- Referenced in 3.x -->
[#599]: https://github.com/tj/commander.js/issues/599
[#611]: https://github.com/tj/commander.js/issues/611
[#697]: https://github.com/tj/commander.js/issues/697
[#795]: https://github.com/tj/commander.js/issues/795
[#915]: https://github.com/tj/commander.js/issues/915
[#938]: https://github.com/tj/commander.js/issues/938
[#963]: https://github.com/tj/commander.js/issues/963
[#974]: https://github.com/tj/commander.js/issues/974
[#980]: https://github.com/tj/commander.js/issues/980
[#987]: https://github.com/tj/commander.js/issues/987
[#990]: https://github.com/tj/commander.js/issues/990
[#991]: https://github.com/tj/commander.js/issues/991
[#999]: https://github.com/tj/commander.js/issues/999
[#1010]: https://github.com/tj/commander.js/pull/1010
[#1018]: https://github.com/tj/commander.js/pull/1018
[#1026]: https://github.com/tj/commander.js/pull/1026
[#1028]: https://github.com/tj/commander.js/pull/1028

[Unreleased]: https://github.com/tj/commander.js/compare/master...develop
[14.0.2]: https://github.com/tj/commander.js/compare/v14.0.1...v14.0.2
[14.0.1]: https://github.com/tj/commander.js/compare/v14.0.0...v14.0.1
[14.0.0]: https://github.com/tj/commander.js/compare/v13.1.0...v14.0.0
[13.1.0]: https://github.com/tj/commander.js/compare/v13.0.0...v13.1.0
[13.0.0]: https://github.com/tj/commander.js/compare/v12.1.0...v13.0.0
[13.0.0-0]: https://github.com/tj/commander.js/compare/v12.1.0...v13.0.0-0
[12.1.0]: https://github.com/tj/commander.js/compare/v12.0.0...v12.1.0
[12.0.0]: https://github.com/tj/commander.js/compare/v11.1.0...v12.0.0
[12.0.0-1]: https://github.com/tj/commander.js/compare/v12.0.0-0...v12.0.0-1
[12.0.0-0]: https://github.com/tj/commander.js/compare/v11.1.0...v12.0.0-0
[11.1.0]: https://github.com/tj/commander.js/compare/v11.0.0...v11.1.0
[11.0.0]: https://github.com/tj/commander.js/compare/v10.0.1...v11.0.0
[10.0.1]: https://github.com/tj/commander.js/compare/v10.0.0...v10.0.1
[10.0.0]: https://github.com/tj/commander.js/compare/v9.5.0...v10.0.0
[9.5.0]: https://github.com/tj/commander.js/compare/v9.4.1...v9.5.0
[9.4.1]: https://github.com/tj/commander.js/compare/v9.4.0...v9.4.1
[9.4.0]: https://github.com/tj/commander.js/compare/v9.3.0...v9.4.0
[9.3.0]: https://github.com/tj/commander.js/compare/v9.2.0...v9.3.0
[9.2.0]: https://github.com/tj/commander.js/compare/v9.1.0...v9.2.0
[9.1.0]: https://github.com/tj/commander.js/compare/v9.0.0...v9.1.0
[9.0.0]: https://github.com/tj/commander.js/compare/v8.3.0...v9.0.0
[9.0.0-1]: https://github.com/tj/commander.js/compare/v9.0.0-0...v9.0.0-1
[9.0.0-0]: https://github.com/tj/commander.js/compare/v8.3.0...v9.0.0-0
[8.3.0]: https://github.com/tj/commander.js/compare/v8.2.0...v8.3.0
[8.2.0]: https://github.com/tj/commander.js/compare/v8.1.0...v8.2.0
[8.1.0]: https://github.com/tj/commander.js/compare/v8.0.0...v8.1.0
[8.0.0]: https://github.com/tj/commander.js/compare/v7.2.0...v8.0.0
[8.0.0-2]: https://github.com/tj/commander.js/compare/v8.0.0-1...v8.0.0-2
[8.0.0-1]: https://github.com/tj/commander.js/compare/v8.0.0-0...v8.0.0-1
[8.0.0-0]: https://github.com/tj/commander.js/compare/v7.2.0...v8.0.0-0
[7.2.0]: https://github.com/tj/commander.js/compare/v7.1.0...v7.2.0
[7.1.0]: https://github.com/tj/commander.js/compare/v7.0.0...v7.1.0
[7.0.0]: https://github.com/tj/commander.js/compare/v6.2.1...v7.0.0
[7.0.0-2]: https://github.com/tj/commander.js/compare/v7.0.0-1...v7.0.0-2
[7.0.0-1]: https://github.com/tj/commander.js/compare/v7.0.0-0...v7.0.0-1
[7.0.0-0]: https://github.com/tj/commander.js/compare/v6.2.0...v7.0.0-0
[6.2.1]: https://github.com/tj/commander.js/compare/v6.2.0..v6.2.1
[6.2.0]: https://github.com/tj/commander.js/compare/v6.1.0..v6.2.0
[6.1.0]: https://github.com/tj/commander.js/compare/v6.0.0..v6.1.0
[6.0.0]: https://github.com/tj/commander.js/compare/v5.1.0..v6.0.0
[6.0.0-0]: https://github.com/tj/commander.js/compare/v5.1.0..v6.0.0-0
[5.1.0]: https://github.com/tj/commander.js/compare/v5.0.0..v5.1.0
[5.0.0]: https://github.com/tj/commander.js/compare/v4.1.1..v5.0.0
[5.0.0-4]: https://github.com/tj/commander.js/compare/v5.0.0-3..v5.0.0-4
[5.0.0-3]: https://github.com/tj/commander.js/compare/v5.0.0-2..v5.0.0-3
[5.0.0-2]: https://github.com/tj/commander.js/compare/v5.0.0-1..v5.0.0-2
[5.0.0-1]: https://github.com/tj/commander.js/compare/v5.0.0-0..v5.0.0-1
[5.0.0-0]: https://github.com/tj/commander.js/compare/v4.1.1..v5.0.0-0
[4.1.1]: https://github.com/tj/commander.js/compare/v4.1.0..v4.1.1
[4.1.0]: https://github.com/tj/commander.js/compare/v4.0.1..v4.1.0
[4.0.1]: https://github.com/tj/commander.js/compare/v4.0.0..v4.0.1
[4.0.0]: https://github.com/tj/commander.js/compare/v3.0.2..v4.0.0
[4.0.0-1]: https://github.com/tj/commander.js/compare/v4.0.0-0..v4.0.0-1
[4.0.0-0]: https://github.com/tj/commander.js/compare/v3.0.2...v4.0.0-0
[3.0.2]: https://github.com/tj/commander.js/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/tj/commander.js/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/tj/commander.js/compare/v2.20.1...v3.0.0
[2.20.1]: https://github.com/tj/commander.js/compare/v2.20.0...v2.20.1
