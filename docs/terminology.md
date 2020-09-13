# Terminology

The command line arguments are made up of options, option-arguments, commands, and command-arguments.

| Term | Explanation |
| --- | --- |
| option | an argument which is a `-` followed by a character, or `--` followed by a word (or hyphenated words), like `-s` or `--short` |
| option-argument| some options can take an argument |
| command | a program or command can have subcommands |
| command-argument | argument for the command (and not an option or option-argument) |

For example:

```sh
my-utility command -o --option option-argument command-argument-1 command-argument-2
```

In other references options are sometimes called flags, and command-arguments are sometimes called positional arguments or operands.
