# Deprecated

These features are deprecated, which means they may go away in a future major version of Commander.
They are currently still available for backwards compatibility, but should not be used in new code.

- [Deprecated](#deprecated)
    - [RegExp .option() parameter](#regexp-option-parameter)
    - [noHelp](#nohelp)
    - [Callback to .help() and .outputHelp()](#callback-to-help-and-outputhelp)
    - [.on('--help')](#on--help)
    - [.on('command:\*')](#oncommand)
    - [.command('\*')](#command)
    - [cmd.description(cmdDescription, argDescriptions)](#cmddescriptioncmddescription-argdescriptions)
    - [InvalidOptionArgumentError](#invalidoptionargumenterror)
    - [Import from `commander/esm.mjs`](#import-from-commanderesmmjs)
    - [cmd.\_args](#cmd_args)
    - [.addHelpCommand(string|boolean|undefined)](#addhelpcommandstringbooleanundefined)
  - [Removed](#removed)
    - [Short option flag longer than a single character](#short-option-flag-longer-than-a-single-character)
    - [Default import of global Command object](#default-import-of-global-command-object)

### RegExp .option() parameter

The `.option()` method allowed a RegExp as the third parameter to restrict what values were accepted.

```js
program.option('-c,--coffee <type>', 'coffee', /short-white|long-black/);
```

Removed from README in Commander v3. Deprecated from Commander v7.

The newer functionality is the Option `.choices()` method, or using a custom option processing function.

### noHelp

This was an option passed to `.command()` to hide the command from the built-in help:

```js
program.command('example', 'example command', { noHelp: true });
```

The option was renamed `hidden` in Commander v5.1. Deprecated from Commander v7.

### Callback to .help() and .outputHelp()

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

### .on('--help')

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

### .on('command:*')

This was emitted when the command argument did not match a known subcommand (as part of the implementation of `.command('*')`).

One use was for adding an error for an unknown subcommand. An error is now the default built-in behaviour.

A second related use was for making a suggestion for an unknown subcommand. The replacement built-in support is `.showSuggestionAfterError()`,
or for custom behaviour catch the `commander.unknownCommand` error.

Deprecated from Commander v8.3.

### .command('*')

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

### cmd.description(cmdDescription, argDescriptions)

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

### InvalidOptionArgumentError

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

### Import from `commander/esm.mjs`

The first support for named imports required an explicit entry file.

```js
import { Command } from 'commander/esm.mjs';
```

This is no longer required, just import directly from the module.

```js
import { Command } from 'commander';
```

README updated in Commander v9. Deprecated from Commander v9.

### cmd._args

This was always private, but was previously the only way to access the command `Argument` array.

```js
const registeredArguments = program._args;
```

The registered command arguments are now accessible via `.registeredArguments`.

```js
const registeredArguments = program.registeredArguments;
```

Deprecated from Commander v11.

### .addHelpCommand(string|boolean|undefined)

This was originally used with a variety of parameters, but not by passing a Command object despite the "add" name.

```js
program.addHelpCommand('assist  [command]');
program.addHelpCommand('assist', 'show assistance');
program.addHelpCommand(false);

```

In new code you configure the help command with `.helpCommand()`. Or use `.addHelpCommand()` which now takes a Command object, like `.addCommand()`.

```js
program.helpCommand('assist [command]');
program.helpCommand('assist', 'show assistance');
program.helpCommand(false);

program.addHelpCommand(new Command('assist').argument('[command]').description('show assistance'));
```

- Removed from README in Commander v12.
- Deprecated from Commander v12.

## Removed

### Short option flag longer than a single character

Short option flags like `-ws` were never supported, but the old README did not make this clear. The README now states that short options are a single character.

- README updated in Commander v3.
- Deprecated from Commander v9.
- Throws an exception in Commander v13. Deprecated and gone!
- Replacement added in Commander v13.1 with support for dual long options, like `--ws, --workspace`.

### Default import of global Command object

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
- Removed from CommonJS in Commander v12. Deprecated and gone!
