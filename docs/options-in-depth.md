<!-- omit from toc -->
# Options in Depth

The README covers declaring and using options, and mostly parsing will work the way you and your users expect. This page covers some special cases
and subtle issues in depth.

- [Options taking varying numbers of option-arguments](#options-taking-varying-numbers-of-option-arguments)
  - [Parsing ambiguity](#parsing-ambiguity)
    - [Alternative: Make `--` part of your syntax](#alternative-make----part-of-your-syntax)
    - [Alternative: Put options last](#alternative-put-options-last)
    - [Alternative: Use options instead of command-arguments](#alternative-use-options-instead-of-command-arguments)
- [Combining short options, and options taking arguments](#combining-short-options-and-options-taking-arguments)
  - [Combining short options as if boolean](#combining-short-options-as-if-boolean)

## Options taking varying numbers of option-arguments

Certain options take a varying number of arguments:

```js
program
   .option('-c, --compress [percentage]') // 0 or 1
   .option('--preprocess <file...>') // 1 or more
   .option('--test [name...]') // 0 or more
```

This section uses examples with options taking 0 or 1 arguments, but the discussions also apply to variadic options taking more arguments.

For information about terms used in this document see: [terminology](./terminology.md)

### Parsing ambiguity

There is a potential downside to be aware of. If a command has both
command-arguments and options with varying option-arguments, this introduces a parsing ambiguity which may affect the user of your program.
Commander looks for option-arguments first, but the user may
intend the argument following the option as a command or command-argument.

```js
program
  .name('cook')
  .argument('[technique]')
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

$ cook -i scrambled  # oops
technique: undefined
ingredient: scrambled
```

The explicit way to resolve this is use `--` to indicate the end of the options and option-arguments:

```sh
$ node cook.js -i -- scrambled
technique: scrambled
ingredient: cheese
```

If you want to avoid your users needing to learn when to use `--`, there are a few approaches you could take.

#### Alternative: Make `--` part of your syntax

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

#### Alternative: Put options last

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

#### Alternative: Use options instead of command-arguments

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

## Combining short options, and options taking arguments

Multiple boolean short options can be combined after a single `-`, like `ls -al`. You can also include just
a single short option which might take a value, as any following characters will
be taken as the value.

This means that by default you can not combine short options which may take an argument.

```js
program
  .name('collect')
  .option("-o, --other [count]", "other serving(s)")
  .option("-v, --vegan [count]", "vegan serving(s)")
  .option("-l, --halal [count]", "halal serving(s)");
program.parse(process.argv);

const opts = program.opts();
if (opts.other) console.log(`other servings: ${opts.other}`);
if (opts.vegan) console.log(`vegan servings: ${opts.vegan}`);
if (opts.halal) console.log(`halal servings: ${opts.halal}`);
```

```sh
$ collect -o 3
other servings: 3
$ collect -o3
other servings: 3
$ collect -l -v
vegan servings: true
halal servings: true
$ collect -lv  # oops
halal servings: v
```

If you wish to use options taking varying arguments as boolean options, you need to specify them separately.

```console
$ collect -a -v -l
any servings: true
vegan servings: true
halal servings: true
```

### Combining short options as if boolean

Before Commander v5, combining a short option and the value was not supported, and combined short flags were always expanded.
So `-avl` expanded to `-a -v -l`.

If you want backwards compatible behaviour, or prefer combining short options as booleans to combining short option and value,
you may change the behaviour.

To modify the parsing of options taking an optional value:

```js
.combineFlagAndOptionalValue(true)  // `-v45` is treated like `--vegan=45`, this is the default behaviour
.combineFlagAndOptionalValue(false) // `-vl` is treated like `-v -l`
```
