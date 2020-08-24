# Tricks and traps when using options with optional values

There are potential challenges using options with optional values. They seem quite attractive and the README used to use them more than options with require values but in practice, they are a bit tricky and aren't a free choice.

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

For example, you may intend `brew` to be passed as a subcommand. Instead, it will be read as the passed in value for `-o`. Likewise, you may intend `nextArg` to be passed as an argument but it too, will be read as the passed in value for `-o`

### Possible workarounds

To reduce such ambiguity, you can do the following:

1. always use `--` before operands
2. add your options after operands
3. convert arguments into options! Options work pretty nicely together.

## Combining short flags with optional values

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
