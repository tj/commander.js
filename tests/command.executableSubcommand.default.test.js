const childProcess = require('child_process');
const path = require('path');

// Calling node explicitly so pm works without file suffix cross-platform.

const pm = path.join(__dirname, './fixtures/pm');

test('when default subcommand and no command then call default', (done) => {
  childProcess.exec(`node ${pm}`, function(_error, stdout, stderr) {
    expect(stdout).toBe('default\n');
    done();
  });
});

test('when default subcommand and unrecognised argument then call default with argument', (done) => {
  childProcess.exec(`node ${pm} an-argument`, function(_error, stdout, stderr) {
    expect(stdout).toBe("default\n[ 'an-argument' ]\n");
    done();
  });
});

test('when default subcommand and unrecognised option then call default with option', (done) => {
  childProcess.exec(`node ${pm} --an-option`, function(_error, stdout, stderr) {
    expect(stdout).toBe("default\n[ '--an-option' ]\n");
    done();
  });
});
