var program = require('../')
	, should = require('should');

program
	.version('0.0.1')
	.option('-f, --foo', 'add some foo')
	.option('-b, --bar*', 'add some bar - mandatory');

var mandatoryOptionName;
program.Command.prototype.missingMandatoryOption = function(name) {
	mandatoryOptionName = name;
};
program.parse(['node', 'test', '-f', 'aFoo']);
mandatoryOptionName.should.equal('bar');
