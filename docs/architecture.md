# Architecture

A short map of the Commander source for people reading or changing the code. For how to *use* Commander, see the [README](../Readme.md) and the other files in `docs/`.

## Layout

| Path | Lines | What it holds |
|------|------:|---------------|
| `index.js` | — | Public entry point. Re-exports the classes from `lib/` and creates the default `program` instance. |
| `lib/command.js` | ~2,800 | `Command`: definition API (`.command()`, `.option()`, `.argument()`, `.action()`), parsing, dispatch to subcommands, help and error output. Most changes land here. |
| `lib/option.js` | ~380 | `Option` (flag parsing, defaults, choices, env, conflicts/implies) and `DualOptions` (handling `--foo` / `--no-foo` pairs). |
| `lib/argument.js` | ~150 | `Argument` (required/optional/variadic, defaults, choices) and `humanReadableArgName()`. |
| `lib/help.js` | ~730 | `Help`: formats the help text. Subclass it or use `configureHelp()` to customise output. |
| `lib/error.js` | ~40 | `CommanderError` and `InvalidArgumentError`. |
| `lib/suggestSimilar.js` | ~100 | "Did you mean …?" suggestions for unknown commands and options (edit distance). |
| `typings/` | | Hand-written TypeScript declarations; keep in sync with `lib/`. Type tests run with `tsd`. |
| `tests/` | | Jest tests, roughly one file per feature. |
| `examples/` | | Runnable examples referenced from the README. |

Commander has no production dependencies; `lib/` only imports Node built-ins (`node:events`, `node:child_process`, `node:path`, `node:fs`, `node:process`, `node:util`).

## Module dependencies

```
index.js ──► command.js ──► argument.js ──► error.js
                 │  ├──────► option.js ────► error.js
                 │  ├──────► help.js ──────► argument.js
                 │  ├──────► error.js
                 │  └──────► suggestSimilar.js
```

`help.js` refers back to `Command`, `Option` and `Argument` only through JSDoc `@typedef { import(...) }` comments, so there is no runtime cycle.

## How a parse flows

1. `program.parse(argv)` / `parseAsync(argv)` normalises `argv` (node, electron, or `{ from: 'user' }`) and calls `_parseCommand([], userArgs)`.
2. `_parseCommand` splits the arguments into known options, operands and unknown args (`parseOptions`), then decides what to run.
3. If the first operand names a subcommand, `_dispatchSubcommand` either recurses into that `Command`'s `_parseCommand`, or, for stand-alone executable subcommands, calls `_executeSubCommand`, which spawns a separate process via `child_process`.
4. Otherwise, it processes arguments for the current command, runs the `preAction` hooks, calls the action handler, then runs the `postAction` hooks.
5. Errors and help/version output go through `_exit` / `CommanderError`, which `exitOverride()` can intercept.

## Where to make a change

- New option behaviour: `lib/option.js`, plus how `Command` reads it in `lib/command.js`. Then update `typings/index.d.ts`, the tests and the README.
- Help formatting: `lib/help.js` (the README "Custom help" section and `docs/help-in-depth.md` document it).
- Parsing edge cases: `lib/command.js` (`parseOptions`, `_parseCommand`) and `docs/parsing-and-hooks.md`.

---
<sub>Drafted with [RepoLens](https://github.com/CHAPIBUNNY/repolens), checked by hand.</sub>
