# Changelog for 5.x

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
[#1062]: https://github.com/tj/commander.js/pull/1062
[#1088]: https://github.com/tj/commander.js/issues/1088
[#1119]: https://github.com/tj/commander.js/pull/1119
[#1133]: https://github.com/tj/commander.js/pull/1133
[#1138]: https://github.com/tj/commander.js/pull/1138
[#1145]: https://github.com/tj/commander.js/pull/1145
[#1146]: https://github.com/tj/commander.js/pull/1146
[#1149]: https://github.com/tj/commander.js/pull/1149
[#1153]: https://github.com/tj/commander.js/issues/1153
[#1159]: https://github.com/tj/commander.js/pull/1159
[#1165]: https://github.com/tj/commander.js/pull/1165
[#1169]: https://github.com/tj/commander.js/pull/1169
[#1172]: https://github.com/tj/commander.js/pull/1172
[#1179]: https://github.com/tj/commander.js/pull/1179
[#1180]: https://github.com/tj/commander.js/pull/1180
[#1184]: https://github.com/tj/commander.js/pull/1184
[#1191]: https://github.com/tj/commander.js/pull/1191
[#1195]: https://github.com/tj/commander.js/pull/1195
[#1208]: https://github.com/tj/commander.js/pull/1208
[#1232]: https://github.com/tj/commander.js/pull/1232
[#1235]: https://github.com/tj/commander.js/pull/1235
[#1236]: https://github.com/tj/commander.js/pull/1236
[#1247]: https://github.com/tj/commander.js/pull/1247
[#1248]: https://github.com/tj/commander.js/pull/1248

[5.1.0]: https://github.com/tj/commander.js/compare/v5.0.0..v5.1.0
[5.0.0]: https://github.com/tj/commander.js/compare/v4.1.1..v5.0.0
[5.0.0-4]: https://github.com/tj/commander.js/compare/v5.0.0-3..v5.0.0-4
[5.0.0-3]: https://github.com/tj/commander.js/compare/v5.0.0-2..v5.0.0-3
[5.0.0-2]: https://github.com/tj/commander.js/compare/v5.0.0-1..v5.0.0-2
[5.0.0-1]: https://github.com/tj/commander.js/compare/v5.0.0-0..v5.0.0-1
[5.0.0-0]: https://github.com/tj/commander.js/compare/v4.1.1..v5.0.0-0
