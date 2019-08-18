var program = require('../')
  , sinon = require('sinon').createSandbox()
  , should = require('should');

// test should make sure that the description is not wrapped when there’s
// insufficient space for the wrapped description and every line would only
// contains some words.
program
  .command('alpha', `This text should also not be wrapped manually. Reprehenderit velit nulla nisi excepteur dolore cillum nisi reprehenderit.`)
  .command(
    'betabetabteabteabetabetabteabteabetabetabteabteabetabasdsasdfsdf',
    'description text of very long command should not be automatically be wrapped. Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu.'
  );

var expectedOutput = `Usage:  [options] [command]

Options:
  -h, --help                                                        output usage information

Commands:
  alpha                                                             This text should also not be wrapped manually. Reprehenderit velit nulla nisi excepteur dolore cillum nisi reprehenderit.
  betabetabteabteabetabetabteabteabetabetabteabteabetabasdsasdfsdf  description text of very long command should not be automatically be wrapped. Do fugiat eiusmod ipsum laboris excepteur pariatur sint ullamco tempor labore eu.
`;

process.stdout.columns = 80;
program.helpInformation().should.equal(expectedOutput);
