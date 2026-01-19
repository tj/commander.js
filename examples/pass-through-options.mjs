#!/usr/bin/env node

import { Command } from 'commander';
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
//    node pass-through-options.mjs git status
//    node pass-through-options.mjs git --version
//    node pass-through-options.mjs --dry-run git checkout -b new-branch
//    node pass-through-options.mjs git push --dry-run
