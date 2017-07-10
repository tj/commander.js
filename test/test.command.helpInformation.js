var program = require('../')
  , sinon = require('sinon').sandbox.create()
  , should = require('should');

program.option('-x, --x-option', 'option x');

var helpText = program.helpInformation();
helpText.should.containEql('-h, --help');
helpText.should.containEql('-x, --x-option');
/**
 * User defined -h should override help option short flag.
 * In the help information text, -h short flag should
 * only appear for the user defined option.
 */
program
  .option('-h, --h-option', 'User defined -h.');

helpText = program.helpInformation();
helpText.should.containEql('-h, --h-option');
helpText.should.not.containEql('-h, --help');
helpText.should.containEql('--help');

program.parse(['node', 'test', '-h']);
program.should.have.property('hOption');
