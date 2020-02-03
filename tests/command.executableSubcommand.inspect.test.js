const childProcess = require('child_process');
const path = require('path');
const util = require('util');

const execFileAsync = util.promisify(childProcess.execFile);

// Test the special handling for --inspect to increment fixed debug port numbers.
// If we reuse port we can get conflicts because port not released fast enough.

const inspectCommand = path.join(__dirname, './fixtures', 'inspect.js');

test('when execArgv empty then spawn execArgs empty', async() => {
  const { stdout } = await execFileAsync('node', [inspectCommand, 'sub']);
  expect(stdout).toBe('[]\n');
});

test('when execArgv --harmony then spawn execArgs --harmony', async() => {
  const { stdout } = await execFileAsync('node', ['--harmony', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--harmony' ]\n");
});

// --inspect defaults to 127.0.0.1:9229, port should be incremented
test('when execArgv --inspect then spawn execArgs using port 9230', async() => {
  const { stdout } = await execFileAsync('node', ['--inspect', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=127.0.0.1:9230' ]\n");
});

// custom port
test('when execArgv --inspect=9240 then spawn execArgs using port 9241', async() => {
  const { stdout } = await execFileAsync('node', ['--inspect=9240', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=127.0.0.1:9241' ]\n");
});

// zero is special, random port
test('when execArgv --inspect=0 then spawn execArgs --inspect=0', async() => {
  const { stdout } = await execFileAsync('node', ['--inspect=0', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=0' ]\n");
});

// ip address
test('when execArgv --inspect=127.0.0.1:9250 then spawn execArgs --inspect=127.0.0.1:9251', async() => {
  const { stdout } = await execFileAsync('node', ['--inspect=127.0.0.1:9250', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=127.0.0.1:9251' ]\n");
});

// localhost
test('when execArgv --inspect=localhost:9260 then spawn execArgs --inspect=localhost:9261', async() => {
  const { stdout } = await execFileAsync('node', ['--inspect=localhost:9260', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect=localhost:9261' ]\n");
});

// --inspect-port, just test most likely format
test('when execArgv --inspect-port=9270 then spawn execArgs --inspect-port=127.0.0.1:9271', async() => {
  const { stdout } = await execFileAsync('node', ['--inspect-port=9270', inspectCommand, 'sub']);
  expect(stdout).toBe("[ '--inspect-port=127.0.0.1:9271' ]\n");
});
