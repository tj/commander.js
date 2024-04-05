#!/usr/bin/env node
const { Command, Option } = require('commander');
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
//    node options-env.js --help
//
//    node options-env.js
//    PORT=9001 node options-env.js
//    PORT=9001 node options-env.js --port 123
//
//    COLOUR= node options-env.js
//    COLOUR= node options-env.js --no-colour
//    NO_COLOUR= node options-env.js
//    NO_COLOUR= node options-env.js --colour
//
//    SIZE=small node options-env.js
//    SIZE=enormous node options-env.js
//    SIZE=enormous node options-env.js --size=large
