# Help in Depth

The built-in help is formatted using the Help class.
You can configure the Help behaviour by modifying data properties and methods using `.configureHelp()`, or by subclassing using `.createHelp()` if you prefer.

Example file: [configure-help.js](../examples/configure-help.js)

```js
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() // Just show the name, instead of short usage.
});
```

- [Help in Depth](#help-in-depth)
  - [Data Properties](#data-properties)
  - [Stringify and Style](#stringify-and-style)
  - [Layout](#layout)

## Data Properties

The data properties are:

- `helpWidth`: specify the wrap width, useful for unit tests
- `minWidthToWrap`: specify required width to allow wrapping (default 40)
- `showGlobalOptions`: show a section with the global options from the parent command(s)
- `sortSubcommands`: sort the subcommands alphabetically
- `sortOptions`: sort the options alphabetically

Example files:
- [configure-help.js](../examples/configure-help.js)
- [global-options-nested.js](../examples/global-options-nested.js)

## Stringify and Style

The `Help` object has narrowly focused methods to allow customising the displayed help.

The stringify routines take an object (`Command` or `Option` or `Argument`) and produce a string. For example you could change the way subcommands are listed:

```js
program.configureHelp({
  subcommandTerm: (cmd) => cmd.name() // just show the name instead of usage
});
```

The style routines take just a string. For example to make the titles bold:

```js
import { styleText } from 'node:util';
program.configureHelp({
   styleTitle: (str) => styleText('bold', str)
});
```

There is built-in support for detecting whether the output has colors, and respecting environment variables for `NO_COLOR`, `FORCE_COLOR`, and `CLIFORCE_COLOR`. The style routines always get called and color is stripped afterwards if needed using `Command.configureOutput().stripColor()`.

This annotated help output shows where the stringify and style routines are used. The first output is for a program with subcommands, and the second output is for a subcommand with arguments. 


```text
Usage: color-help [options] [command]
<-1--> <-------------2-------------->
       <---a----> <---b---> <---c--->

program description
<--------3-------->

Options:
<--1--->
  -h, --help               display help for command
  <---4---->               <---------5------------>

Commands:
<---1--->
  print [options] <files>  print files
  <----------6---------->  <----7---->
  <-b-> <---c---> <--d-->
```

|  | stringify(object) | style(string) | default style |
| - | - | - | - |
| 1 | | styleTitle | |
| 2 | commandUsage | styleUsage | a, b, c, d |
| 3 | commandDescription | styleCommandDescription | styleDescriptionText |
| 4 | optionTerm | styleOptionTerm | styleOptionText |
| 5 | optionDescription | styleOptionDescription | styleDescriptionText |
| 6 | subcommandTerm | styleSubcommandTerm | b, c, d |
| 7 | subcommandDescription | styleSubcommandDescription |  styleDescriptionText|
| 8 | argumentTerm | styleArgumentTerm | styleArgumentText |
| 9 | argumentDescription | styleArgumentDescription | styleDescriptionText |
| a | | styleCommandText | |
| b | | styleOptionText | |
| c | | styleSubcommandText | |
| d | | styleArgumentText | |

```text
Usage: color-help print [options] <files...>
<-1--> <---------------2------------------->
       <---a----> <-c-> <---b---> <---d---->

Arguments:
<---1---->
  files  files to queue for printing
  <-8->  <------------9------------>
...
```

Color example files:

- [color-help.mjs](../examples/color-help.mjs)
- [color-help-replacement.mjs](../examples/color-help-replacement.mjs)

Stringify example files (`subcommandTerm`):

- [help-subcommands-usage.js](../examples/help-subcommands-usage.js)
- [configure-help.js](../examples/configure-help.js)

## Layout

Utility methods which control the layout include `padWidth`, `boxWrap`, and `formatItem`. These can be overridden to change the layout or replace with an alternative implementation.

Example files:

- `formatItem`: [help-centered.mjs](../examples/help-centered.mjs)
- `formatItem`: [man-style-help.mjs](../examples/man-style-help.mjs)
- `boxwrap`: [color-help-replacement.mjs](../examples/color-help-replacement.mjs)

