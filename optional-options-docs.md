# Tricks and traps when using options with optional values

There are potential challenges using options with optional values. They seem quite attractive and the README used to use them more than options with require values but in practice, they are a bit tricky and aren't a free choice.

## Terminology

| Term(s)                                    | Explanation                                                                                                                                                                                                                                          | code example (if any)                        |
| ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------- |
| option(s), flags, non-positional arguments | The term options consist of hyphen-minus characters <br />(that is ‘-’) followed by letters or digits. <br /> options can take an argument or choose not to. <br/>options that do not take an argument are term boolean flag(s) or boolean option(s) | `.option('-s, --small', 'small pizza size')` |
| option argument(s)                         | options are followed by an option argument. <br /> If they are enclosed with square brackets `[]`, these option arguments are optional.                                                                                                              | `.option('-o, --option [optionalValue]')`    |
| operand(s), non-option argument(s)         | arguments following the last options and option-arguments are named “operands”                                                                                                                                                                       | `.arguments('[file]')`                       |

## Parsing ambiguity

There is parsing ambiguity when using option as boolean flag and also having it accept operands (sometimes called a positional argument or command argument, referring to `Command.arguments()`) and subcommands.

```
program
  .arguments("[technique]")
  .option("-i, --ingredient [ingredient]")
  .action((args, cmdObj) => {
    console.log(args);
    console.log(cmdObj.opts());
  });

program.parse();
```

```
$ cook scrambled
scrambled
{ ingredient: undefined }

$ cook -i
undefined
{ ingredient: true }

$ cook -i egg
undefined
{ ingredient: egg }

$ cook -i scrambled
undefined
{ ingredient: scrambled }
```

For example, you may intend `scrambled` to be passed as a non-option argument. Instead, it will be read as the passed in value for ingredient.

### Possible workarounds

To reduce such ambiguity, you can do the following:

1. always use `--` before operands
2. add your options after operands
3. convert operands into options! Options work pretty nicely together.

The POSIX convention is that options always come before operands. The GNU utility convention allows options to come before or after the operands. Commander follows the GNU convention and allows options before or after the operands. So by putting the options last, the option values do not get confused with the operands.

## Combining short flags with optional values

optional options are option(s) which functions as a flag but may also take a value (declared using square brackets).

optional values (sometimes called option arguments) are values of these optional flag.

```
program
  .option("-o, --others [count]", "others servings")
  .option("-v, --vegan [count]", "vegan servings")
  .option("-l, --halal [count]", "halal servings");
program.parse(process.argv);

if (program.others) console.log(`others servings: ${program.others}`);
if (program.vegan) console.log(`vegan servings: ${program.vegan}`);
if (program.halal) console.log(`halal servings: ${program.halal}`);

```

In this example, you have to take note that optional options consume the value after the short flag.

```
$ collect -avl
any servings: vl
```

If you wish to use optional options as boolean options, you need to explicitly list them as individual options.

```
$ collect -a -v -l
any servings: true
vegan servings: true
halal servings: true
```

Likewise for variadic options. While options can have a single optional value, variadic options can take in multiple optional values and have the same parsing complications.

```
program
  .option("-c, --citizenship <countries...>", "countries you hold passport of") // 1 or more value(s)
  .option("-i, --illness [illness...]", "known illness before travel") // 0 or more value(s)
  .option("-s, --visa-approved [status]", "status of visa if not approved"); // 0 ir 1 value

program.parse();

console.log(`Citizen of: `, program.citizenship);
console.log(`Known illness(es): `, program.illness);
console.log(`visa approved: ${program.visaApproved}`);
```

Optional options consume the value after the short flag and you will experience the following behaviour:

```
$ node opt.js -si
Known illness(es):  undefined
visa approved: i

$ node opt.js -is
Known illness(es):  [ 's' ]
visa approved: undefined
```

If you wish to use variadic optional options as booleans, you will need to state them explicitly as follows:

```
$ node opt.js -i -s
Known illness(es):  true
visa approved: true
```

You should also be careful when you mix variadic optional options with variadic required options. A required option **always** consumes a value and so, you will not get any errors when the first value passed to it contains a '-' like so:

```
$ node opt.js -c -si
Citizen of:  [ '-si' ] // Does not throw error
```

```
$ node opt.js -c -si -x
error: unknown option '-x'

$ node opt.js -c -si -i
Citizen of:  [ '-si' ]
Known illness(es):  true
```

### Behaviour change from v5 to v6

Before Commander v5, `-ob` expanded to `-o -b`, which is different from the current behaviour in Commander v6 as explained above.

This new behaviour may be an issue for people upgrading from older versions of Commander but we do have plans to prioritise combining flags over combining flag-and-value in the future.
