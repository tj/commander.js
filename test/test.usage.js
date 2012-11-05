var program = require('../')
  , should = require('should');

program
  .version('0.0.1')
  .usage('[-i | --interactive] [options]')
  .option('-i, --interactive', 'interactive')
  .option('--continue', 'continue')
  .option('--skip', 'skip')
  .option('--abort', 'abort');


// first usage option
program.usage().should.equal('[-i | --interactive] [options]');


// it should allow multiple usage calls
program.usage('--continue | --skip | --abort');
program.usage().should.equal('[-i | --interactive] [options]\n--continue | --skip | --abort');


program.parse(['node', 'test', '-i']);


// it should output proper help info
program.helpInformation().should.equal( [
    ''
  , '  Usage: test [-i | --interactive] [options]'
  , '              --continue | --skip | --abort'
  , ''
  , '  Options:'
  , ''
  , '    -h, --help         output usage information'
  , '    -V, --version      output the version number'
  , '    -i, --interactive  interactive'
  , '    --continue         continue'
  , '    --skip             skip'
  , '    --abort            abort'
  , ''
  , ''
].join('\n') );


