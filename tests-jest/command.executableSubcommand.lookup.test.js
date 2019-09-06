const childProcess = require('child_process');
const path = require('path');

const bin = path.join(__dirname, '../test/fixtures/pm');

test('when subcommand file missing then error', () => {
  childProcess.exec(bin + ' list', function(_error, stdout, stderr) {
    expect(stderr).toBe('error: pm-list(1) does not exist, try --help\n');
  });
});

test('when subcommand file has no suffix then lookup succeeds', () => {
  childProcess.exec(bin + ' install', function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
  });
});

test('when subcommand file suffix .js then lookup succeeds', () => {
  childProcess.exec(bin + ' publish', function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
  });
});

// This is not a behaviour we enforce but rather one that is expected.
test('when subcommand file not executable then error', () => {
  childProcess.exec(bin + ' search', function(error, stdout, stderr) {
    expect(error.toString()).toMatch('not executable');
  });
});

test('when subcommand file is symlink then lookup succeeds', () => {
  const binLink = path.join(__dirname, '../test/fixtures/pmlink');
  childProcess.exec(binLink + ' install', function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
  });
});

test('when subcommand file is double symlink then lookup succeeds', () => {
  const binLink = path.join(__dirname, '../test/fixtures/another-dir/pm');
  childProcess.exec(binLink + ' install', function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
  });
});
