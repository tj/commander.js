import { Command } from '../index.js';

/**
 * Create a Command configured for using in tests.
 *
 * Throws exceptions instead of calling process.exit (.exitOverride())
 * and output suppressed.
 *
 * @returns Command
 */

export function createTestCommand() {
  const cmd = new Command();
  cmd
    .exitOverride() // So we get exceptions instead of process.exit
    .configureOutput({
      writeOut: () => {},
      writeErr: () => {},
    });
  return cmd;
}
