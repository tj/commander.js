var program = require('../')
  , sinon = require('sinon').createSandbox()
  , should = require('should');

// make sure descriptions which are manually wrapped and indented are not
// changed by in the output to maintain backwards compatibility to <3.0
program
  .option(
    '-t, --time <HH:MM>',
    `select time

  Time can also be specified using special values:

  "dawn" - From night to sunrise.
  "sunrise" - Time around sunrise.
  "morning" - From sunrise to noon.
  `
  )
  .option(
    '-d, --date <YYYY-MM-DD>',
    `select date`
  );

var expectedOutput = `Usage:  [options]

Options:
  -t, --time <HH:MM>       select time
  
    Time can also be specified using special values:
  
    "dawn" - From night to sunrise.
    "sunrise" - Time around sunrise.
    "morning" - From sunrise to noon.
    
  -d, --date <YYYY-MM-DD>  select date
  -h, --help               output usage information
`;

process.stdout.columns = 80;
program.helpInformation().should.equal(expectedOutput);
