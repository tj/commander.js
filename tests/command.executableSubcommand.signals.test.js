const childProcess = require('child_process');
const path = require('path');

const pmPath = path.join(__dirname, 'fixtures', 'pm');

// Disabling some tests on Windows as:
// "Windows does not support sending signals"
//  https://nodejs.org/api/process.html#process_signal_events
const describeOrSkipOnWindows =
  process.platform === 'win32' ? describe.skip : describe;

describeOrSkipOnWindows('signals', () => {
  test.each(['SIGINT', 'SIGHUP', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'])(
    'when program sent %s then executableSubcommand sent signal too',
    (signal, done) => {
      // Spawn program. The listen subcommand waits for a signal and writes the name of the signal to stdout.
      const proc = childProcess.spawn(pmPath, ['listen'], {});

      let processOutput = '';
      proc.stdout.on('data', (data) => {
        if (processOutput.length === 0) {
          // Send signal to program.
          proc.kill(`${signal}`);
        }
        processOutput += data.toString();
      });
      proc.on('close', (code) => {
        // Check the child subcommand received the signal too.
        expect(processOutput).toBe(`Listening for signal...${signal}`);
        done();
      });
    },
  );

  test('when executable subcommand sent signal then program exit code is non-zero', () => {
    const { status } = childProcess.spawnSync(pmPath, ['terminate'], {});
    expect(status).toBeGreaterThan(0);
  });

  test('when command has exitOverride and executable subcommand sent signal then exit code is non-zero', () => {
    const { status } = childProcess.spawnSync(
      pmPath,
      ['exit-override', 'terminate'],
      {},
    );
    expect(status).toBeGreaterThan(0);
  });

  // Not a signal test, but closely related code so adding here.
  test('when command has exitOverride and executable subcommand fails then program exit code is subcommand exit code', () => {
    const { status } = childProcess.spawnSync(
      pmPath,
      ['exit-override', 'fail'],
      {},
    );
    expect(status).toEqual(42);
  });
});
