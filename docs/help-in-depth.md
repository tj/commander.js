# Help in Depth

The `Help` object has focused methods to allow customising the displayed help.

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

This annotated help output shows where the stringify and style routines are used. The first
output is for a program with subcommands, and the second output is for a subcommand with arguments. Example file: [color-help.mjs](../examples/color-help.mjs)


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
| 1 | | styleTitle | a, b, c, d |
| 2 | commandUsage | styleUsage | |
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
