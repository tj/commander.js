# Unloved Features

You may come across features that are not described in the README: in existing programs, or mentioned in issues, or by inspecting the Commander code. Check here
to find out more, and whether they could be used or should be avoided.

## Deprecated

These features are deprecated, which means they may go away in a future major version of Commander.
They are currently still available for backwards compatibility, but should not be used in new code.

### RegExp Option Parameter

The option method allowed a RegExp as the third parameter to restrict what values were accepted. Removed from README from Commander v3.

```js
program.option('-c,--coffee <type>', 'coffee', /short-white|long-black/);
```

The newer functionality is the custom option processing function passed in the same parameter position.

### command('*')

This was called when the command was not known:

```js
program.command('*')
```

The newer functionality is setting a command as the default command using the `isDefault` option in the `.command()` parameters. Available for action handlers from Commander v5.

You can also use a listener for `.on('command:*', handler)` for custom processing for unknown commands.

### noHelp

This was an option passed to `.command()` to hide the command from the built-in help:

```js
program.command('example', 'examnple command', { noHelp: true });
```

The option has been renamed `hidden` from Commander v5.1.

### Default Import

The default import was a global Command object.

```js
const program = require('commander');
```

The global Command object is exported as `program` from Commander v5, or import the Command object.

```js
const { program } = require('commander');
// or
const { Command } = require('commander');
comnst program = new Command()
```

## Unloved

These legacy features have never been documented in the README. Still unsure whether there are
solid enough and useful enough to eventually be added to the README, or whether they may
be deprecated and/or replaced.

### allowUnknownOptions

Used to suppress the error handling when unknown options are found:

```js
program.allowUnknownOptions();
```

The main effect is simply suppressing the error handling, and the unknown options
are passed through as ordinary arguments to process yourself. Commander
does not attempt to extract (guess) the unknown options and values.

### Argument Descriptions

The `.description()` method allows a second parameter with descriptions of the command arguments.
The parameter is a hash with key of the argument name and value of the description. Using this adds an "Arguments:" section in the built-in help.

```js
program
  .arguments('<file>')
  .description('print target file', {
    file: 'file to process'
  });
```
