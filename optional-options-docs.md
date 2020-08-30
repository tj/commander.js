# More About Options

The README covers declaring and using options, and mostly parsing will work the way you and your users expect. This page covers some special cases
and subtle issues in depth.

- [More About Options](#more-about-options)
  - [Terminology](#terminology)
  - [Options taking varying numbers of option-arguments](#options-taking-varying-numbers-of-option-arguments)
    - [Parsing ambiguity](#parsing-ambiguity)
    - [Alternative: Make  `--` part of your syntax](#alternative-make----part-of-your-syntax)
    - [Alternative: Put options last](#alternative-put-options-last)
    - [Alternative: Use options instead of command-arguments](#alternative-use-options-instead-of-command-arguments)
  - [Combining short flags with optional values](#combining-short-flags-with-optional-values)
    - [Behaviour change from v5 to v6](#behaviour-change-from-v5-to-v6)

## Terminology

_Work in progress: this section may move to the main README, or a page of its own._

The command line arguments are made up of options, option-arguments, commands, and command-arguments.

| Term | Explanation |
| --- | --- |
| option | an argument which begins with a dash and a character, or a double-dash and a word |
| option-argument| some options can take an argument |
| command | a program or command can have subcommands |
| command-argument | argument for the command (and not an option or option-argument) |

For example:

```sh
my-utility command -o --option option-argument command-argument-1 command-argument-2
```

In other references options are sometimes called flags, and command-arguments are sometimes called positional arguments.

## Options taking varying numbers of option-arguments

Certain options take a varying number of option-arguments:

```js
program
   .option('-c, --compress [percentage]') // 0 or 1
   .option('--preprocess <file...>') // 1 or more
   .option('--test [name...]') // 0 or more
```

### Parsing ambiguity

There is a potential downside to be aware of. If a command has both
command-arguments and options with varying option-arguments, this introduces a parsing ambiguity which may affect the user of your program.
Commander looks for option-arguments first, but the user may
intend the argument following the option as a command or command-argument.

```js
program
  .name('cook')
  .arguments('[technique]')
  .option('-i, --ingredient [ingredient]', 'add cheese or given ingredient')
  .action((technique, options) => {
    console.log(`technique: ${technique}`);
    const ingredient = (options.ingredient === true) ? 'cheese' : options.ingredient;
    console.log(`ingredient: ${ingredient}`);
  });

program.parse();
```

```sh
$ cook scrambled
technique: scrambled
ingredient: undefined

$ cook -i
technique: undefined
ingredient: cheese

$ cook -i egg
technique: undefined
ingredient: egg

$ cook -i scrambled # oops
technique: undefined
ingredient: scrambled
```

The explicit way to resolve this is use `--` to indicate the end of the options and option-arguments:

```sh
$ node cook.js -i -- egg
technique: egg
ingredient: cheese
```

If you want to avoid your users needing to learn when to use `--`, there are a few approaches you could take.

### Alternative: Make  `--` part of your syntax

Rather than trying to teach your users what `--` does, you could just make it part of your syntax.

```js
program.usage('[options] -- [technique]');
```

```sh
$ cook --help
Usage: cook [options] -- [technique]

Options:
  -i, --ingredient [ingredient]  add cheese or given ingredient
  -h, --help                     display help for command

$ cook -- scrambled
technique: scrambled
ingredient: undefined

$ cook -i -- scrambled
technique: scrambled
ingredient: cheese
```

### Alternative: Put options last

Commander follows the GNU convention for parsing and allows options before or after the command-arguments, or intermingled.
So by putting the options last, the command-arguments do not get confused with the option-arguments.

```js
program.usage('[technique] [options]');
```

```sh
$ cook --help
Usage: cook [technique] [options]

Options:
  -i, --ingredient [ingredient]  add cheese or given ingredient
  -h, --help                     display help for command

$ node cook.js scrambled -i
technique: scrambled
ingredient: cheese
```

### Alternative: Use options instead of command-arguments

This is a bit more radical, but completely avoids the parsing ambiguity!

```js
program
  .name('cook')
  .option('-t, --technique <technique>', 'cooking technique')
  .option('-i, --ingredient [ingredient]', 'add cheese or given ingredient')
  .action((options) => {
    console.log(`technique: ${options.technique}`);
    const ingredient = (options.ingredient === true) ? 'cheese' : options.ingredient;
    console.log(`ingredient: ${ingredient}`);
  });
```

```sh
$ cook -i -t scrambled
technique: scrambled
ingredient: cheese
```

------
_Work in progress: unreviewed from here down._

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
