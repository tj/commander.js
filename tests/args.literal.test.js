import { Command } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { promisify } from 'node:util';
import * as childProcess from 'child_process';
import * as path from 'path';

// Utility Conventions: http://pubs.opengroup.org/onlinepubs/9699919799/basedefs/V1_chap12.html#tag_12_02
//
// 12.2 Utility Syntax Guidelines, Guideline 10:
// The first -- argument that is not an option-argument should be accepted as a delimiter indicating the end of options. Any following arguments should be treated as operands, even if they begin with the '-' character.

const execFileAsync = promisify(childProcess.execFile);

function makeCmdWithOptions(name) {
  return new Command(name)
    .option('-f, --foo', 'add some foo')
    .option('-b, --bar', 'add some bar')
    .argument('[args...]')
    .exitOverride()
    .action(() => {});
}

describe('end of options delimiter "--"', () => {
  test('when arguments include -- then stop processing options', () => {
    const program = makeCmdWithOptions('program');
    program.parse(['--foo', '--', '--bar', '--unknown', 'ARG'], {
      from: 'user',
    });

    const opts = program.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(program.args, ['--bar', '--unknown', 'ARG']);
  });

  test('when arguments include multiple -- then extras are passed-through as args', () => {
    const program = makeCmdWithOptions('program');
    program.parse(['--foo', '--', '--bar', '--', '--unknown', 'ARG'], {
      from: 'user',
    });

    const opts = program.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(program.args, ['--bar', '--', '--unknown', 'ARG']);
  });

  test('when arguments end with -- then -- still stripped', () => {
    const program = makeCmdWithOptions('program');
    program.parse(['--foo', 'ARG', '--'], {
      from: 'user',
    });

    const opts = program.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(program.args, ['ARG']);
  });

  test('when -- after arg then options stripped', () => {
    const program = makeCmdWithOptions('program');
    program.parse(['ARG', '--', '--unknown'], {
      from: 'user',
    });

    assert.deepEqual(program.args, ['ARG', '--unknown']);
  });

  test('when arguments include -- before sub then option processing stops', () => {
    const program = new Command().exitOverride();
    const sub = makeCmdWithOptions('sub');
    program.addCommand(sub);
    program.parse(['--', 'sub', '--foo', 'ARG'], { from: 'user' });

    assert.deepEqual(sub.args, ['--foo', 'ARG']);
  });

  test('when arguments include -- directly after sub then option processing stops', () => {
    const program = new Command().exitOverride();
    const sub = makeCmdWithOptions('sub');
    program.addCommand(sub);
    program.parse(['sub', '--', '--foo', 'ARG'], { from: 'user' });

    assert.deepEqual(sub.args, ['--foo', 'ARG']);
  });

  test('when arguments include -- in sub args then option processing stops', () => {
    const program = new Command().exitOverride();
    const sub = makeCmdWithOptions('sub');
    program.addCommand(sub);
    program.parse(['sub', '--foo', '--', '--bar', '--unknown', 'ARG'], {
      from: 'user',
    });

    const opts = sub.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(sub.args, ['--bar', '--unknown', 'ARG']);
  });

  test('when arguments include -- and default command then options processing', () => {
    const program = new Command().exitOverride();
    const sub = makeCmdWithOptions('sub');
    program.addCommand(sub, { isDefault: true });
    program.parse(['--foo', '--', '--bar', '--unknown', 'ARG'], {
      from: 'user',
    });
    const opts = sub.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(sub.args, ['--bar', '--unknown', 'ARG']);
  });

  // action handler
  test('when arguments include -- after non-matching command then options processing stops for action handler', () => {
    // Fairly exotic to have an action handler and subcommands, but run a test.
    let actionArgs;
    const program = makeCmdWithOptions('program');
    program.action((args) => {
      actionArgs = args;
    });
    program.command('sub');
    program.parse(
      ['--foo', 'non-matching', '--', '--bar', '--unknown', 'ARG'],
      {
        from: 'user',
      },
    );
    const opts = program.opts();
    assert.equal(opts.foo, true);
    assert.equal(opts.bar, undefined);
    assert.deepEqual(actionArgs, ['non-matching', '--bar', '--unknown', 'ARG']);
  });

  // action handler
  test('when arguments include -- after non-matching command and argument then -- stripped', () => {
    // Fairly exotic to have an action handler and subcommands, but run a test.
    // (Spotted problem with -- .)
    let actionArgs;
    const program = makeCmdWithOptions('program');
    program.action((args) => {
      actionArgs = args;
    });
    program.command('sub');
    program.parse(['non-matching', '--', '--unknown'], {
      from: 'user',
    });
    assert.deepEqual(actionArgs, ['non-matching', '--unknown']);
  });

  test('when arguments include -- after (allowed) unknown option then -- preserved', () => {
    // This is more of a historical behaviour than a design behaviour, but reasonable for options
    // that are likely to be passed through to another command of some sort.
    const program = makeCmdWithOptions('program');
    program.allowUnknownOption();
    program.parse(['--unknown', '--', '--foo'], {
      from: 'user',
    });
    assert.deepEqual(program.args, ['--unknown', '--', '--foo']);
  });

  test('when arguments include -- before external subcommand then not passed to subcommand', async () => {
    // The behaviour for action handler and external subcommands is different here.
    // The `--` came before the subcommand and not injecting it into external subcommand arguments.
    // (When the -- comes among the subcommand arguments, it is preserved. See other tests.)
    const pm = path.join(import.meta.dirname, 'fixtures/pm');
    const { stdout } = await execFileAsync('node', [
      pm,
      '--',
      'echo',
      '--foo',
      'ARG',
    ]);

    assert.equal(stdout, '["--foo","ARG"]\n');
  });

  test('when arguments include -- after external subcommand then passed to subcommand', async () => {
    const pm = path.join(import.meta.dirname, 'fixtures/pm');
    const { stdout } = await execFileAsync('node', [
      pm,
      'echo',
      '--',
      '--foo',
      'ARG',
    ]);

    assert.equal(stdout, '["--","--foo","ARG"]\n');
  });

  test('when arguments include -- after external subcommand argument then passed to subcommand', async () => {
    const pm = path.join(import.meta.dirname, 'fixtures/pm');
    const { stdout } = await execFileAsync('node', [
      pm,
      'echo',
      'ARG',
      '--',
      '--foo',
    ]);

    assert.equal(stdout, '["ARG","--","--foo"]\n');
  });
});
