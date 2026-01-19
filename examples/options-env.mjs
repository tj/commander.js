#!/usr/bin/env node
import { Command, Option } from 'commander';
const program = new Command();

program.addOption(
  new Option('-p, --port <number>', 'specify port number')
    .default(80)
    .env('PORT'),
);
program.addOption(
  new Option('-c, --colour', 'turn on colour output').env('COLOUR'),
);
program.addOption(
  new Option('-C, --no-colour', 'turn off colour output').env('NO_COLOUR'),
);
program.addOption(
  new Option('-s, --size <type>', 'specify size of drink')
    .choices(['small', 'medium', 'large'])
    .env('SIZE'),
);

program.parse();
console.log(program.opts());

// Try the following:
//    node options-env.mjs --help
//
//    node options-env.mjs
//    PORT=9001 node options-env.mjs
//    PORT=9001 node options-env.mjs --port 123
//
//    COLOUR= node options-env.mjs
//    COLOUR= node options-env.mjs --no-colour
//    NO_COLOUR= node options-env.mjs
//    NO_COLOUR= node options-env.mjs --colour
//
//    SIZE=small node options-env.mjs
//    SIZE=enormous node options-env.mjs
//    SIZE=enormous node options-env.mjs --size=large
