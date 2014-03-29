/**
 * Module dependencies.
 */

var program = require('../')
  , should = require('should');

function watchStdout() {
  var oldWrite = process.stdout.write
    , output = '';

  process.stdout.write = (function(write) {
    return function(string, encoding, fd) {
      //write.apply(process.stdout, arguments);
      output += string;
    };
  })(process.stdout.write);

  process.exit = function () {};

  return function() {
    process.stdout.write = oldWrite;
    return output;
  };
}

var oldProcessExit = process.exit;
 
program
  .wrap()
  .option('-l, --long', 'This is a long option description. The purpose of this is to demonstrate how option descriptions will wrap over multiple lines')
  .option('-s, --short', 'This is a short option description');

program
  .command('long')
  .description('This is a long command description. The purpose of this is to demonstrate how command descriptions will wrap over multiple lines');

program
  .command('short')
  .description('This is a short command description');

// output contents of default `wrap`
program.parse(['node', 'test', '--help']);


// constrained wrap
program
  .wrap(80);

var unwatch = watchStdout()
  , helpText;

program.parse(['node', 'test', '--help']);

helpText = unwatch();

// options
helpText.should.contain('    -s, --short  This is a short option description');
helpText.should.contain('    -l, --long   This is a long option description. The purpose of this is to\n                 demonstrate how option descriptions will wrap over multiple\n                 lines');

// commands
helpText.should.contain('    short                  This is a short command description');
helpText.should.contain('    long                   This is a long command description. The purpose of\n                           this is to demonstrate how command descriptions will\n                           wrap over multiple lines');

// columns too small
(function smallColumn() {
  program
    .wrap(50);
}).should.throw();

process.exit = oldProcessExit;
