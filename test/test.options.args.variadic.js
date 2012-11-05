var program = require('../')
  , should = require('should');


// inspired by "http://cheeseorfont.com/play"

program
  .version('0.0.1')
  .option('-c, --cheese <types...>', 'specify the types of cheese')
  .option('-f, --fonts [families...]', 'specify the font families')
  .option('-b, --bool', 'boolean flag');


program.parse(['node', 'test', '--cheese', 'feta', 'ricotta', 'cheddar']);
program.cheese.should.eql(['feta', 'ricotta', 'cheddar']);


program.parse(['node', 'test', '-f', 'fantezi', 'gallaudet', 'tarocco']);
program.fonts.should.eql(['fantezi', 'gallaudet', 'tarocco']);


// make sure other options doesn't mess with values
program.parse(['node', 'test', '-f', 'fantezi', 'gallaudet', 'tarocco', '-c', 'feta', '-b']);
program.fonts.should.eql(['fantezi', 'gallaudet', 'tarocco']);
program.cheese.should.eql(['feta']);
program.bool.should.be.true;


program.parse(['node', 'test', '-f', 'helvetica']);
program.fonts.should.eql(['helvetica']);


program.parse(['node', 'test', '-f']);
program.fonts.should.eql([]);


// Make sure we still catch errors with required values for options
var exceptionOccurred = false;
var oldProcessExit = process.exit;
var oldConsoleError = console.error;
process.exit = function() { exceptionOccurred = true; throw new Error('test error'); };
console.error = function(msg) { };

try {
  program.parse(['node', 'test', '-c']);
} catch(err) {
  err.message.should.equal('test error');
}

exceptionOccurred.should.be.true;

// restore
console.error = oldConsoleError;
process.exit = oldProcessExit;
