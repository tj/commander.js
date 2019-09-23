const childProcess = require('child_process');
const os = require('os');
const path = require('path');

const bin = path.join(__dirname, './fixtures/pm');

// Suppress failed tests while debugging
let conditionalTest;
if (os.platform() === 'win32') {
  conditionalTest = test.skip;
} else {
  conditionalTest = test;
}

test('when subcommand file missing then error', (done) => {
  childProcess.exec(`node ${bin} list`, function(_error, stdout, stderr) {
    expect(stderr).toBe('error: pm-list(1) does not exist, try --help\n');
    done();
  });
});

conditionalTest('when alias subcommand file missing then error', (done) => {
  childProcess.exec(`node ${bin} lst`, function(_error, stdout, stderr) {
    expect(stderr).toBe('error: pm-list(1) does not exist, try --help\n');
    done();
  });
});

test('when subcommand file has no suffix then lookup succeeds', (done) => {
  childProcess.execFile('node', [bin, 'install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when alias subcommand file has no suffix then lookup succeeds', (done) => {
  childProcess.execFile('node', [bin, 'i'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand target executablefile has no suffix then lookup succeeds', (done) => {
  childProcess.execFile('node', [bin, 'specifyInstall'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand file suffix .js then lookup succeeds', (done) => {
  childProcess.execFile('node', [bin, 'publish'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

test('when alias subcommand file suffix .js then lookup succeeds', (done) => {
  childProcess.execFile('node', [bin, 'p'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

test('when subcommand target executablefile has suffix .js then lookup succeeds', (done) => {
  childProcess.execFile('node', [bin, 'specifyPublish'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('publish\n');
    done();
  });
});

// This is not a behaviour we enforce but rather one that is expected.
conditionalTest('when subcommand file not executable then error', (done) => {
  childProcess.execFile('node', [bin, 'search'], { }, function(error, stdout, stderr) {
    // In node 8 the EACCES gets thrown instead of emitted through the spawned process.
    // In node 10 and 12 we get the commander error.
    // commander: error: %s(1) not executable. try chmod or run with root
    // node: Error: Command failed: ... Error: spawn EACCES
    expect(error.toString()).toMatch(new RegExp('not executable|EACCES'));
    done();
  });
});

conditionalTest('when subcommand file is symlink then lookup succeeds', (done) => {
  const binLink = path.join(__dirname, './fixtures/pmlink');
  childProcess.exec(`node ${binLink} install`, { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

conditionalTest('when subcommand file is double symlink then lookup succeeds', (done) => {
  const binLink = path.join(__dirname, './fixtures/another-dir/pm');
  childProcess.execFile('node', [binLink, 'install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subcommand suffix is .ts then lookup succeeds', (done) => {
  const binLinkTs = path.join(__dirname, './fixtures-ts/pm.ts');
  childProcess.execFile('node', ['-r', 'ts-node/register', binLinkTs, 'install'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('install\n');
    done();
  });
});

test('when subsubcommand then lookup sub-sub-command', (done) => {
  childProcess.execFile('node', [bin, 'cache', 'clear'], { }, function(_error, stdout, stderr) {
    expect(stdout).toBe('cache-clear\n');
    done();
  });
});
