const childProcess = require('child_process');
const path = require('path');

const bin = path.join(__dirname, '../test/fixtures/pm');

test('when subcommand file missing then error', (done) => {
  childProcess.execFile(bin, ['list'], function(_error, stdout, stderr) {
    expect(stderr).toBe('error: pm-list(1) does not exist, try --help\n');
    done();
  });
});

test('when subcommand file has no suffix then lookup succeeds', (done) => {
  childProcess.execFile(bin, ['install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand file suffix .js then lookup succeeds', (done) => {
  childProcess.execFile(bin, ['publish'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

// This is not a behaviour we enforce but rather one that is expected.
test('when subcommand file not executable then error', (done) => {
  childProcess.execFile(bin, ['search'], { }, function(error, stdout, stderr) {
    expect(error.toString()).toMatch('not executable');
    done();
  });
});

test('when subcommand file is symlink then lookup succeeds', (done) => {
  const binLink = path.join(__dirname, '../test/fixtures/pmlink');
  childProcess.execFile(binLink, ['install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand file is double symlink then lookup succeeds', (done) => {
  const binLink = path.join(__dirname, '../test/fixtures/another-dir/pm');
  childProcess.execFile(binLink, ['install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand suffix is .ts then lookup succeeds', (done) => {
  const binLinkTs = path.join(__dirname, '../test/fixtures-ts/pm.ts');
  childProcess.execFile('node', ['-r', 'ts-node/register', binLinkTs, 'install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});
