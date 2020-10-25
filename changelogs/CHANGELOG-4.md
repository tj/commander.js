# Changelog for 4.x

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
* `.exitOverride()` allows override of calls to `process.exit` for additional error handling and to keep program running ([#1040])
* support for declaring required options with `.requiredOptions()` ([#1071])
* GitHub Actions support ([#1027])
* translation links in README

### Changed

* dev: switch tests from Sinon+Should to Jest with major rewrite of tests ([#1035])
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

[#1027]: https://github.com/tj/commander.js/pull/1027
[#1035]: https://github.com/tj/commander.js/pull/1035
[#1040]: https://github.com/tj/commander.js/pull/1040
[#1047]: https://github.com/tj/commander.js/pull/1047
[#1048]: https://github.com/tj/commander.js/pull/1048
[#1049]: https://github.com/tj/commander.js/pull/1049
[#1051]: https://github.com/tj/commander.js/pull/1051
[#1052]: https://github.com/tj/commander.js/pull/1052
[#1053]: https://github.com/tj/commander.js/pull/1053
[#1071]: https://github.com/tj/commander.js/pull/1071
[#1081]: https://github.com/tj/commander.js/pull/1081
[#1091]: https://github.com/tj/commander.js/pull/1091
[#1096]: https://github.com/tj/commander.js/pull/1096
[#1102]: https://github.com/tj/commander.js/pull/1102
[#1118]: https://github.com/tj/commander.js/pull/1118
[#1157]: https://github.com/tj/commander.js/pull/1157
[#806]: https://github.com/tj/commander.js/issues/806

[4.1.1]: https://github.com/tj/commander.js/compare/v4.1.0..v4.1.1
[4.1.0]: https://github.com/tj/commander.js/compare/v4.0.1..v4.1.0
[4.0.1]: https://github.com/tj/commander.js/compare/v4.0.0..v4.0.1
[4.0.0]: https://github.com/tj/commander.js/compare/v3.0.2..v4.0.0
[4.0.0-1]: https://github.com/tj/commander.js/compare/v4.0.0-0..v4.0.0-1
[4.0.0-0]: https://github.com/tj/commander.js/compare/v3.0.2...v4.0.0-0
