const childProcess = require('child_process');
const path = require('path');

// Test that a signal sent to the parent process is received by the executable subcommand process (which is listening)

test('when command killed with SIGINT then executableSubcommand receieves SIGINT', (done) => {
  const pmPath = path.join(__dirname, '../test/fixtures/pm');

  // The child process writes dots to stdout.
  var proc = childProcess.spawn(pmPath, ['listen2'], {});

  let processOutput = '';
  proc.stdout.on('data', (data) => {
    if (processOutput.length === 0) {
      proc.kill('SIGINT');
    }
    processOutput += data.toString();
  });
  proc.on('close', (code) => {
    expect(processOutput).toBe('Listening for signal...SIGINT');
    done();
  });
});
