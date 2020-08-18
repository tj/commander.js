# Tricks and traps when using options with optional values

There potential challenges using options with optional values. They seem quite attractive and the README used to use them more than options with require values but in practice, they are a bit tricky and aren't a free choice.

## Parsing ambiguity

There is parsing ambiguity when using option as boolean flag and also having it accept operands and subcommands.

```
program.command('example')
      .option("-o, --option [optionalValue]")
      .command('brew')
      .action(() => {
        console.log("example brew");
      })

program.parse(process.argv);

if (program.option) console.log(`option: ${program.option}`);
```

```
$ example -o
option: true
$ example -o thisValueIsPassedToOption
option: thisValueIsPassedToOption
$ example -o brew
option: brew
$ example -o nextArg
option: nextArg
```

For example, the user may intend `brew` to be passed as a subcommand. Instead, it will be read as the passed in value for `-o`. Likewise, the user may intend `nextArg` to be passed as an argument but it too, will be read as the passed in value for `-o`

### Possible workarounds

To reduce such ambiguity, you can do the following:

1. always use `--` before operands
2. add your options after operands
3. convert arguments into options! Options work pretty nicely together.

## Combining short flags with optional values

```
program
  .option("-a, --any [count]", "any servings")
  .option("-v, --vegan [count]", "vegan servings")
  .option("-l, --halal [count]", "halal servings");
program.parse(process.argv);

if (program.any) console.log(`any servings: ${program.any}`);
if (program.vegan) console.log(`vegan servings: ${program.vegan}`);
if (program.halal) console.log(`halal servings: ${program.halal}`);

```

In this example, you have to take note that optional options consume the value after the short flag.

```
$ collect -avl
any servings: vl
```

If you wish to use optional options as boolean options, you need to explicity list them as individual options.

```
$ collect -a -v -l
any servings: true
vegan servings: true
halal servings: true
```
