const childProcess = require('child_process');
const path = require('path');

// Test the special handling for --inspect to increment fixed debug port numbers.
// If we reuse port we can get conflicts because port not released fast enough.

const inspectCommand = path.join(__dirname, './fixtures', 'inspect.js');

test('when execArgv empty then spawn execArgs empty', (done) => {
  childProcess.execFile('node', [inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe('[]\n');
    done();
  });
});

test('when execArgv --harmony then spawn execArgs --harmony', (done) => {
  childProcess.execFile('node', ['--harmony', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--harmony' ]\n");
    done();
  });
});

// --inspect defaults to 127.0.0.1:9229, port should be incremented
test('when execArgv --inspect then spawn execArgs using port 9230', (done) => {
  childProcess.execFile('node', ['--inspect', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--inspect=127.0.0.1:9230' ]\n");
    done();
  });
});

// custom port
test('when execArgv --inspect=9240 then spawn execArgs using port 9241', (done) => {
  childProcess.execFile('node', ['--inspect=9240', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--inspect=127.0.0.1:9241' ]\n");
    done();
  });
});

// zero is special, random port
test('when execArgv --inspect=0 then spawn execArgs --inspect=0', (done) => {
  childProcess.execFile('node', ['--inspect=0', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--inspect=0' ]\n");
    done();
  });
});

// ip address
test('when execArgv --inspect=127.0.0.1:9250 then spawn execArgs --inspect=127.0.0.1:9251', (done) => {
  childProcess.execFile('node', ['--inspect=127.0.0.1:9250', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--inspect=127.0.0.1:9251' ]\n");
    done();
  });
});

// localhost
test('when execArgv --inspect=localhost:9260 then spawn execArgs --inspect=localhost:9261', (done) => {
  childProcess.execFile('node', ['--inspect=localhost:9260', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--inspect=localhost:9261' ]\n");
    done();
  });
});

// --inspect-port, just test most likely format
test('when execArgv --inspect-port=9270 then spawn execArgs --inspect-port=127.0.0.1:9271', (done) => {
  childProcess.execFile('node', ['--inspect-port=9270', inspectCommand, 'sub'], function(_error, stdout, stderr) {
    expect(stdout).toBe("[ '--inspect-port=127.0.0.1:9271' ]\n");
    done();
  });
});
