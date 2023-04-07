# Parsing life cycle and hooks

The processing starts with an array of args. Each command processes and removes the options it understands, and passes the remaining args to the next subcommand.
The final command calls the action handler.

Starting with top-level command (program):

- parse options: parse recognised options (for this command) and remove from args
- parse env: look for environment variables (for this command)
- process implied: set any implied option values (for this command)
- if the first arg is a subcommand
    - call `preSubcommand` hooks
    - pass remaining arguments to subcommand, and process same way

Once reach final (leaf) command:

- check for missing mandatory options
- check for conflicting options
- check for unknown options
- process remaining args as command-arguments
- call `preAction` hooks
- call action handler
- call `postAction` hooks
