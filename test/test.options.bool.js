const commander = require('../');
require('should');

// Test simple flag and negatable flag

function simpleFlagProgram() {
  const program = new commander.Command();
  program
    .option('-p, --pepper', 'add pepper')
    .option('-C, --no-cheese', 'remove cheese');
  return program;
}

const simpleFlagNoOptions = simpleFlagProgram();
simpleFlagNoOptions.parse(['node', 'test']);
simpleFlagNoOptions.should.not.have.property('pepper');
simpleFlagNoOptions.cheese.should.be.true();

const simpleFlagLong = simpleFlagProgram();
simpleFlagLong.parse(['node', 'test', '--pepper', '--no-cheese']);
simpleFlagLong.pepper.should.be.true();
simpleFlagLong.cheese.should.be.false();
