import * as childProcess from 'child_process';
import * as path from 'path';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

const __dirname = import.meta.dirname;
const pmPath = path.join(__dirname, 'fixtures', 'pm');

// Disabling some tests on Windows as:
// "Windows does not support sending signals"
//  https://nodejs.org/api/process.html#process_signal_events
const describeOrSkipOnWindows =
  process.platform === 'win32' ? describe.skip : describe;

describeOrSkipOnWindows('executable subcommand signals', () => {
  describe('signal forwarding tests', () => {
    const signals = ['SIGINT', 'SIGHUP', 'SIGTERM', 'SIGUSR1', 'SIGUSR2'];
    for (const signal of signals) {
      test(`when program sent ${signal} then executableSubcommand sent signal too`, (t, done) => {
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
          assert.equal(processOutput, `Listening for signal...${signal}`);
          done();
        });
      });
    }
  });

  test('when executable subcommand sent signal then program exit code is non-zero', () => {
    const { status } = childProcess.spawnSync(pmPath, ['terminate'], {});
    assert.equal(status > 0, true);
  });

  test('when command has exitOverride and executable subcommand sent signal then exit code is non-zero', () => {
    const { status } = childProcess.spawnSync(
      pmPath,
      ['exit-override', 'terminate'],
      {},
    );
    assert.equal(status > 0, true);
  });

  // Not a signal test, but closely related code so adding here.
  test('when command has exitOverride and executable subcommand fails then program exit code is subcommand exit code', () => {
    const { status } = childProcess.spawnSync(
      pmPath,
      ['exit-override', 'fail'],
      {},
    );
    assert.equal(status, 42);
  });
});
