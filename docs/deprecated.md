# Deprecated

These features are deprecated, which means they may go away in a future major version of Commander.
They are currently still available for backwards compatibility, but should not be used in new code.

- [Deprecated](#deprecated)
  - [RegExp .option() parameter](#regexp-option-parameter)
  - [noHelp](#nohelp)
  - [Default import of global Command object](#default-import-of-global-command-object)
  - [Callback to .help() and .outputHelp()](#callback-to-help-and-outputhelp)
  - [.on('--help')](#on--help)
  - [.on('command:*')](#oncommand)
  - [.command('*')](#command)
  - [cmd.description(cmdDescription, argDescriptions)](#cmddescriptioncmddescription-argdescriptions)
  - [InvalidOptionArgumentError](#invalidoptionargumenterror)
  - [Short option flag longer than a single character](#short-option-flag-longer-than-a-single-character)

## RegExp .option() parameter

The `.option()` method allowed a RegExp as the third parameter to restrict what values were accepted.

```js
program.option('-c,--coffee <type>', 'coffee', /short-white|long-black/);
```

Removed from README in Commander v3. Deprecated from Commander v7.

The newer functionality is the Option `.choices()` method, or using a custom option processing function.

## noHelp

This was an option passed to `.command()` to hide the command from the built-in help:

```js
program.command('example', 'examnple command', { noHelp: true });
```

The option was renamed `hidden` in Commander v5.1. Deprecated from Commander v7.

## Default import of global Command object

The default import was a global Command object.

```js
const program = require('commander');
```

The global Command object is exported as `program` from Commander v5, or import the Command object.

```js
const { program } = require('commander');
// or
const { Command } = require('commander');
const program = new Command()
```

- Removed from README in Commander v5.
- Deprecated from Commander v7.
- Removed from TypeScript declarations in Commander v8.

## Callback to .help() and .outputHelp()

These routines allowed a callback parameter to process the built-in help before display.

```js
program.outputHelp((text) => {
  return colors.red(text);
});
```

The newer approach is to directly access the built-in help text using `.helpInformation()`.

```js
console.error(colors.red(program.helpInformation()));
```

Deprecated from Commander v7.

## .on('--help')

This was the way to add custom help after the built-in help. From Commander v3.0.0 this used the custom long help option flags, if changed.

```js
program.on('--help', function() {
  console.log('')
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});
```

The replacement is `.addHelpText()`:

```js
program.addHelpText('after', `
Examples:
  $ custom-help --help
  $ custom-help -h`
);
```

Deprecated from Commander v7.

## .on('command:*')

This was emitted when the command argument did not match a known subcommand (as part of the implementation of `.command('*')`).

One use was for adding an error for an unknown subcommand. An error is now the default built-in behaviour.

A second related use was for making a suggestion for an unknown subcommand. The replacement built-in support is `.showSuggestionAfterError()`,
or for custom behaviour catch the `commander.unknownCommand` error.

Deprecated from Commander v8.3.

## .command('*')

This was used to add a default command to the program.

```js
program
  .command('*')
  .action(() => console.log('List files by default...'));
```

You may now pass a configuration option of `isDefault: true` when adding a command, whether using a subcommand with an action handler or a stand-alone executable subcommand.

```js
program
  .command('list', { isDefault: true })
  .action(() => console.log('List files by default...'));
```

Removed from README in Commander v5. Deprecated from Commander v8.3.

## cmd.description(cmdDescription, argDescriptions)

This was used to add command argument descriptions for the help.

```js
program
  .command('price <book>')
  .description('show price of book', {
    book: 'ISBN number for book'
  });
```

The new approach is to use the `.argument()` method.

```js
program
  .command('price')
  .description('show price of book')
  .argument('<book>', 'ISBN number for book');
```

Deprecated from Commander v8.

## InvalidOptionArgumentError

This was used for throwing an error from custom option processing, for a nice error message.

```js
function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidOptionArgumentError('Not a number.');
  }
  return parsedValue;
}
```

The replacement is `InvalidArgumentError` since can be used now for custom command-argument processing too.

```js
function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and a radix
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}
```

Deprecated from Commander v8.

## Short option flag longer than a single character

Short option flags like `-ws` were never supported, but the old README did not make this clear. The README now states that short options are a single character.

README updated in Commander v3. Deprecated from Commander v9.
