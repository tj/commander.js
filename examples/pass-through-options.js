#!/usr/bin/env node

// const { Command } = require('commander'); // (normal include)
const { Command } = require('../'); // include commander in git clone of commander repo
const program = new Command();

program
  .argument('<utility>')
  .argument('[args...]')
  .passThroughOptions()
  .option('-d, --dry-run')
  .action((utility, args, options) => {
    const action = options.dryRun ? 'Would run' : 'Running';
    console.log(`${action}: ${utility} ${args.join(' ')}`);
  });

program.parse();

// Try the following:
//
//    node pass-through-options.js git status
//    node pass-through-options.js git --version
//    node pass-through-options.js --dry-run git checkout -b new-branch
//    node pass-through-options.js git push --dry-run
