const commander = require('../');
require('should');

// Test combination of flag and --no-flag
// (negatable flag on its own is tested in test.options.bool.js)

function flagProgram(defaultValue) {
  const program = new commander.Command();
  program
    .option('-p, --pepper', 'add pepper', defaultValue)
    .option('-P, --no-pepper', 'remove pepper');
  return program;
}

// Flag with no default, normal usage.

const programNoDefaultNoOptions = flagProgram();
programNoDefaultNoOptions.parse(['node', 'test']);
programNoDefaultNoOptions.should.not.have.property('pepper');

const programNoDefaultWithFlag = flagProgram();
programNoDefaultWithFlag.parse(['node', 'test', '--pepper']);
programNoDefaultWithFlag.pepper.should.be.true();

const programNoDefaultWithNegFlag = flagProgram();
programNoDefaultWithNegFlag.parse(['node', 'test', '--no-pepper']);
programNoDefaultWithNegFlag.pepper.should.be.false();

// Flag with default, say from an environment variable.

const programTrueDefaultNoOptions = flagProgram(true);
programTrueDefaultNoOptions.parse(['node', 'test']);
programTrueDefaultNoOptions.pepper.should.be.true();

const programTrueDefaultWithFlag = flagProgram(true);
programTrueDefaultWithFlag.parse(['node', 'test', '-p']);
programTrueDefaultWithFlag.pepper.should.be.true();

const programTrueDefaultWithNegFlag = flagProgram(true);
programTrueDefaultWithNegFlag.parse(['node', 'test', '-P']);
programTrueDefaultWithNegFlag.pepper.should.be.false();

const programFalseDefaultNoOptions = flagProgram(false);
programFalseDefaultNoOptions.parse(['node', 'test']);
programFalseDefaultNoOptions.pepper.should.be.false();

const programFalseDefaultWithFlag = flagProgram(false);
programFalseDefaultWithFlag.parse(['node', 'test', '-p']);
programFalseDefaultWithFlag.pepper.should.be.true();

const programFalseDefaultWithNegFlag = flagProgram(false);
programFalseDefaultWithNegFlag.parse(['node', 'test', '-P']);
programFalseDefaultWithNegFlag.pepper.should.be.false();

// Flag specified both ways, last one wins.

const programNoYes = flagProgram();
programNoYes.parse(['node', 'test', '--no-pepper', '--pepper']);
programNoYes.pepper.should.be.true();

const programYesNo = flagProgram();
programYesNo.parse(['node', 'test', '--pepper', '--no-pepper']);
programYesNo.pepper.should.be.false();
