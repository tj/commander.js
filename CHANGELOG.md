# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](http://keepachangelog.com/en/1.0.0/)
and this project adheres to [Semantic Versioning](http://semver.org/spec/v2.0.0.html).

<!-- markdownlint-disable MD024 -->
<!-- markdownlint-disable MD004 -->

## [8.0.0-1] (2021-05-30)

### Added

- `.addArgument()` ([#1490])
- `Argument` supports `.choices()` ([#1525])
- client typing of `.opts()` return type using TypeScript generics ([#1539])

### Changed

- refactor `index.tab` into a file per class ([#1522])
- update dependencies

## [8.0.0-0] (2021-05-23)

### Added

- `.getOptionValue()` and `.setOptionValue()` ([#1521])
- `.hook()` with support for `'preAction'` and `'postAction'` callbacks ([#1514])
- `.argument(name, description)` for adding command-arguments ([#1490])
  - supports default value for optional command-arguments ([#1508])
  - supports custom processing function ([#1508])
- `.createArgument()` factory method ([#1497])
- the number of command-arguments is checked for programs without an action handler ([#1502])

### Changed

- refactor and simplify TypeScript declarations (with no default export) ([#1520])
- `.parseAsync()` is now declared as `async` ([#1513])
- *Breaking:* `Help` method `.visibleArguments()` returns array of `Argument` ([#1490])
- *Breaking:* Commander 8 requires Node.js 12 or higher ([#1500])
- *Breaking:* `CommanderError` code `commander.invalidOptionArgument` renamed `commander.invalidArgument` ([#1508])
- *Breaking:* TypeScript declaration for `.addTextHelp()` callback no longer allows result of `undefined`, now just `string` ([#1516])

### Deprecated

- second parameter of `cmd.description(desc, argDescriptions)` for adding argument descriptions ([#1490])
  - (use new `.argument(name, description)` instead)
- `InvalidOptionArgumentError` (replaced by `InvalidArgumentError`) ([#1508])

### Removed

- *Breaking:* TypeScript declaration for default export of global `Command` object ([#1520])
  - (still available as named `program` export)

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
  .action((filename, cmd)) => {
    if (cmd.trace) console.log(`Command name is ${cmd.name()}`);
  });
```

```js
  // New code
  .action((filename, options, command)) => {
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
  .action((filename, command)) => {
    if (command.opts().trace) console.log(`Command name is ${command.name()}`);
  });
```

```js
   // New code
   .action((filename, options, command)) => {
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

- some tests failed if directory path included a space ([1390])

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


## Older versions

* [5.x](./changelogs/CHANGELOG-5.md)
* [4.x](./changelogs/CHANGELOG-4.md)
* [3.x](./changelogs/CHANGELOG-3.md)
* [2.x](./changelogs/CHANGELOG-2.md)
* [1.x](./changelogs/CHANGELOG-1.md)
* [0.x](./changelogs/CHANGELOG-0.md)

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
[#1508]: https://github.com/tj/commander.js/pull/1508
[#1513]: https://github.com/tj/commander.js/pull/1513
[#1514]: https://github.com/tj/commander.js/pull/1514
[#1516]: https://github.com/tj/commander.js/pull/1516
[#1520]: https://github.com/tj/commander.js/pull/1520
[#1521]: https://github.com/tj/commander.js/pull/1521
[#1522]: https://github.com/tj/commander.js/pull/1522
[#1525]: https://github.com/tj/commander.js/pull/1525
[#1539]: https://github.com/tj/commander.js/pull/1539

[Unreleased]: https://github.com/tj/commander.js/compare/master...develop
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
