# Test Ideas

Noting testing ideas as working through existing tests to check whether covered later.

- options are not positional
  - program option before and after command
  - program option before and after program argument
  - command option before and after command argument
- how much is parsing of program same as parsing of command, how much needs testing both program and command?
- add a test of global Command exposed on import
- test `.on()` variations
- test.command.name.js was testing exit if no subcommmand when using executable subcommands (good test), and that help command added (bad test?).
- test.command.name.set.js was testing program.description
