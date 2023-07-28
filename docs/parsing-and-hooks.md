# Parsing life cycle and hooks

The processing starts with an array of args. Each command processes and removes the options it understands, and passes the remaining args to the next subcommand. The final command calls the action handler.

Starting with top-level command (program):

* process options for this command (includes calling or chaining provided argParsers[^1])
  * recognised options from args
  * options based on environment variables
* set implied option values (for this command)
* remove recognised options from args
* await thenable option values if parsing with `parseAsync()`
* if the first arg is a subcommand
  * call or chain `preSubcommand` hooks[^1]
  * pass remaining arguments to subcommand, and process same way

Once reach final (leaf) command:

* check for missing mandatory options
* check for conflicting options
* check for unknown options
* process remaining args as command-arguments (includes calling or chaining provided argParsers[^1])
* await thenable argument values if parsing with `parseAsync()`
* if an action handler is provided
  * call or chain `preAction` hooks[^1]
  * call or chain action handler[^1]
  * call or chain `postAction` hooks[^1]
</details>

[^1]: output a warning suggesting use of `parseAsync()` when parsing with `parse()` and a thenable is returned, unless `process.env.NODE_ENV === 'production'`
