const childProcess = require('child_process');
const path = require('path');

// Calling node explicitly so pm works without file suffix cross-platform.

const testOrSkipOnWindows = (process.platform === 'win32') ? test.skip : test;
const pm = path.join(__dirname, './fixtures/pm');

test('when subcommand file missing then error', (done) => {
  childProcess.exec(`node ${pm} list`, function(_error, stdout, stderr) {
    if (process.platform === 'win32') {
      // Get uncaught thrown error on Windows
      expect(stderr.length).toBeGreaterThan(0);
    } else {
      expect(stderr).toBe('error: pm-list(1) does not exist, try --help\n');
    }
    done();
  });
});

test('when alias subcommand file missing then error', (done) => {
  childProcess.exec(`node ${pm} lst`, function(_error, stdout, stderr) {
    if (process.platform === 'win32') {
      // Get uncaught thrown error on Windows
      expect(stderr.length).toBeGreaterThan(0);
    } else {
      expect(stderr).toBe('error: pm-list(1) does not exist, try --help\n');
    }
    done();
  });
});

test('when subcommand file has no suffix then lookup succeeds', (done) => {
  childProcess.exec(`node ${pm} install`, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when alias subcommand file has no suffix then lookup succeeds', (done) => {
  childProcess.exec(`node ${pm} i`, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand target executablefile has no suffix then lookup succeeds', (done) => {
  childProcess.exec(`node ${pm} specifyInstall`, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand file suffix .js then lookup succeeds', (done) => {
  childProcess.exec(`node ${pm} publish`, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

test('when alias subcommand file suffix .js then lookup succeeds', (done) => {
  childProcess.exec(`node ${pm} p`, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

test('when subcommand target executablefile has suffix .js then lookup succeeds', (done) => {
  childProcess.exec(`node ${pm} specifyPublish`, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

testOrSkipOnWindows('when subcommand file is symlink then lookup succeeds', (done) => {
  const pmlink = path.join(__dirname, 'fixtures', 'pmlink');
  childProcess.exec(`node ${pmlink} install`, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

testOrSkipOnWindows('when subcommand file is double symlink then lookup succeeds', (done) => {
  const pmlink = path.join(__dirname, 'fixtures', 'another-dir', 'pm');
  childProcess.exec(`node ${pmlink} install`, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand suffix is .ts then lookup succeeds', (done) => {
  jest.setTimeout(20000); // Extend timeout for GitHub Actions
  const binLinkTs = path.join(__dirname, 'fixtures-ts', 'pm.ts');
  childProcess.execFile('node', ['-r', 'ts-node/register', binLinkTs, 'install'], function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subsubcommand then lookup sub-sub-command', (done) => {
  childProcess.exec(`node ${pm} cache clear`, function(_error, stdout, stderr) {
    expect(stdout).toBe('cache-clear\n');
    done();
  });
});
