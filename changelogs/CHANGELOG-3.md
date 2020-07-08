
# Changelog for 3.x

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

[3.0.2]: https://github.com/tj/commander.js/compare/v3.0.1...v3.0.2
[3.0.1]: https://github.com/tj/commander.js/compare/v3.0.0...v3.0.1
[3.0.0]: https://github.com/tj/commander.js/compare/v2.20.1...v3.0.0
