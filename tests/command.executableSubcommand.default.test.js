const childProcess = require('child_process');
const path = require('path');

const bin = path.join(__dirname, './fixtures/pm');

test('when default subcommand and no command then call default', (done) => {
  childProcess.execFile(bin, [], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('default\n');
    done();
  });
});

test('when default subcommand and unrecognised argument then call default', (done) => {
  childProcess.execFile(bin, ['unrecognised-argument'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('default\n');
    done();
  });
});
