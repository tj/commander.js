var program = require('../')
  , should = require('should');

var capturedExitCode, capturedOutput, oldProcessExit, oldProcessStdoutWrite;

program.version('0.0.1', '-r, --revision');

['-r', '--revision'].forEach(function (flag) {
  capturedExitCode = -1;
  capturedOutput = '';
  oldProcessExit = process.exit;
  oldProcessStdoutWrite = process.stdout.write;
  process.exit = function (code) { capturedExitCode = code; }
  process.stdout.write = function(output) { capturedOutput += output; }
  program.parse(['node', 'test', flag]);
  process.exit = oldProcessExit;
  process.stdout.write = oldProcessStdoutWrite;
  capturedOutput.should.equal('0.0.1\n');
  capturedExitCode.should.equal(0);
})
