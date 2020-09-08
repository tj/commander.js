# Deprecated

These features are deprecated, which means they may go away in a future major version of Commander.
They are currently still available for backwards compatibility, but should not be used in new code.

## RegExp .option() parameter

The `.option()` method allowed a RegExp as the third parameter to restrict what values were accepted.

```js
program.option('-c,--coffee <type>', 'coffee', /short-white|long-black/);
```

Removed from README in Commander v3. Deprecated from Commander v7.

The newer functionality is the custom option processing function passed in the same parameter position.

## noHelp

This was an option passed to `.command()` to hide the command from the built-in help:

```js
program.command('example', 'examnple command', { noHelp: true });
```

The option has been renamed `hidden` from Commander v5.1.

Deprecated from Commander v7. 

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
comnst program = new Command()
```

Deprecated from Commander v7. 

## Callback to .help() and .outputHelp()

These routines allowed a callback parameter to process the built-in help before display.

```js
program.outputHelp((text) => {
  return colors.red(text);
});
```

You can work with the built-in help via `.helpInformation()`.


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
