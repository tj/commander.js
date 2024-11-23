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

This annotated help output shows where the stringify and style routines are used.

```text
Usage: color-help print [options] <files>
<-1--> <-------------2------------------>
       <---a----> <-b-> <---c---> <--d-->

command description
<------3-------->

Arguments:
<---1---->
  files                    target files
  <-4->                    <----5----->

Options:
<--1--->
  -h, --help               display help for command
  <---6---->               <---------7------------>

Commands:
<---1--->
  print [options] <files>  display help for command
  <----------8---------->  <---------9------------>
  <-b-> <---c---> <--d-->

```

|  | stringify(object) | style(string) | default style |
| - | - | - | - |
| 1 | | styleTitle | a, b, c, d |
| 2 | commandUsage | styleUsage | |
| 3 | commandDescription | styleCommandDescription | styleDescriptionText |
| 4 | argumentTerm | styleArgumentTerm | styleArgumentText |
| 5 | argumentDescription | styleItemDescription | styleDescriptionText |
| 6 | optionTerm | styleOptionTerm | styleOptionText |
| 7 | optionDescription | styleItemDescription | styleDescriptionText |
| 8 | subcommandTerm | styleSubcommandTerm | b, c, d |
| 9 | subcommandDescription | styleItemDescription |  styleDescriptionText|
| a | | styleCommandText | |
| b | | styleSubcommandText | |
| c | | styleOptionText | |
| d | | styleArgumentText | |

