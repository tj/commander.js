import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('Command.hook()', () => {
  test('when hook event wrong then throw', () => {
    const program = new commander.Command();
    assert.throws(() => {
      program.hook('silly', () => {});
    });
  });

  test('when no action then action hooks not called', (t) => {
    const hook = t.mock.fn();
    const program = new commander.Command();
    program.hook('preAction', hook).hook('postAction', hook);
    program.parse([], { from: 'user' });
    assert.equal(hook.mock.callCount(), 0);
  });

  describe('action hooks with synchronous hooks, order', () => {
    test('when hook preAction then hook called before action', () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', () => calls.push('before'))
        .action(() => calls.push('action'));
      program.parse([], { from: 'user' });
      assert.deepEqual(calls, ['before', 'action']);
    });

    test('when hook postAction then hook called after action', () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('postAction', () => calls.push('after'))
        .action(() => calls.push('action'));
      program.parse([], { from: 'user' });
      assert.deepEqual(calls, ['action', 'after']);
    });

    test('when hook preAction twice then hooks called FIFO', () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', () => calls.push('1'))
        .hook('preAction', () => calls.push('2'))
        .action(() => calls.push('action'));
      program.parse([], { from: 'user' });
      assert.deepEqual(calls, ['1', '2', 'action']);
    });

    test('when hook postAction twice then hooks called LIFO', () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('postAction', () => calls.push('1'))
        .hook('postAction', () => calls.push('2'))
        .action(() => calls.push('action'));
      program.parse([], { from: 'user' });
      assert.deepEqual(calls, ['action', '2', '1']);
    });

    test('when hook preAction at program and sub then hooks called program then sub', () => {
      const calls = [];
      const program = new commander.Command();
      program.hook('preAction', () => calls.push('program'));
      program
        .command('sub')
        .hook('preAction', () => calls.push('sub'))
        .action(() => calls.push('action'));
      program.parse(['sub'], { from: 'user' });
      assert.deepEqual(calls, ['program', 'sub', 'action']);
    });

    test('when hook postAction at program and sub then hooks called sub then program', () => {
      const calls = [];
      const program = new commander.Command();
      program.hook('postAction', () => calls.push('program'));
      program
        .command('sub')
        .hook('postAction', () => calls.push('sub'))
        .action(() => calls.push('action'));
      program.parse(['sub'], { from: 'user' });
      assert.deepEqual(calls, ['action', 'sub', 'program']);
    });

    test('when hook everything then hooks called nested', () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', () => calls.push('pb1'))
        .hook('postAction', () => calls.push('pa1'));
      program
        .hook('preAction', () => calls.push('pb2'))
        .hook('postAction', () => calls.push('pa2'));
      program
        .command('sub')
        .hook('preAction', () => calls.push('sb'))
        .hook('postAction', () => calls.push('sa'))
        .action(() => calls.push('action'));
      program.parse(['sub'], { from: 'user' });
      assert.deepEqual(calls, [
        'pb1',
        'pb2',
        'sb',
        'action',
        'sa',
        'pa2',
        'pa1',
      ]);
    });
  });

  describe('action hooks context', () => {
    test('when hook on program then passed program/program', (t) => {
      const hook = t.mock.fn();
      const program = new commander.Command();
      program.hook('preAction', hook).action(() => {});
      program.parse([], { from: 'user' });
      assert.equal(hook.mock.callCount(), 1);
      const callArgs = hook.mock.calls[0].arguments;
      assert.equal(callArgs[0], program);
      assert.equal(callArgs[1], program);
    });

    test('when hook on program and call sub then passed program/sub', (t) => {
      const hook = t.mock.fn();
      const program = new commander.Command();
      program.hook('preAction', hook);
      const sub = program.command('sub').action(() => {});
      program.parse(['sub'], { from: 'user' });
      assert.equal(hook.mock.callCount(), 1);
      const callArgs = hook.mock.calls[0].arguments;
      assert.equal(callArgs[0], program);
      assert.equal(callArgs[1], sub);
    });

    test('when hook on sub and call sub then passed sub/sub', (t) => {
      const hook = t.mock.fn();
      const program = new commander.Command();
      const sub = program
        .command('sub')
        .hook('preAction', hook)
        .action(() => {});
      program.parse(['sub'], { from: 'user' });
      assert.equal(hook.mock.callCount(), 1);
      const callArgs = hook.mock.calls[0].arguments;
      assert.equal(callArgs[0], sub);
      assert.equal(callArgs[1], sub);
    });

    test('when hook program on preAction then thisCommand has options set', () => {
      const program = new commander.Command();
      program
        .option('--debug')
        .hook('preAction', (thisCommand) => {
          assert.equal(thisCommand.opts().debug, true);
        })
        .action(() => {});
      program.parse(['--debug'], { from: 'user' });
    });

    test('when hook program on preAction and call sub then thisCommand has program options set', () => {
      const program = new commander.Command();
      program.option('--debug').hook('preAction', (thisCommand) => {
        assert.equal(thisCommand.opts().debug, true);
      });
      program.command('sub').action(() => {});
      program.parse(['sub', '--debug'], { from: 'user' });
    });

    test('when hook program on preAction and call sub then actionCommand has sub options set', () => {
      const program = new commander.Command();
      program.hook('preAction', (thisCommand, actionCommand) => {
        assert.equal(actionCommand.opts().debug, true);
      });
      program
        .command('sub')
        .option('--debug')
        .action(() => {});
      program.parse(['sub', '--debug'], { from: 'user' });
    });

    test('when hook program on preAction then actionCommand has args set', () => {
      const program = new commander.Command();
      program
        .argument('[arg]')
        .hook('preAction', (thisCommand, actionCommand) => {
          assert.deepEqual(actionCommand.args, ['value']);
        })
        .action(() => {});
      program.parse(['value'], { from: 'user' });
    });

    test('when hook program on preAction then actionCommand has args set with options removed', () => {
      const program = new commander.Command();
      program
        .argument('[arg]')
        .option('--debug')
        .hook('preAction', (thisCommand, actionCommand) => {
          assert.deepEqual(actionCommand.args, ['value']);
        })
        .action(() => {});
      program.parse(['value', '--debug'], { from: 'user' });
    });

    test('when hook program on preAction and call sub then thisCommand has program args set', () => {
      const program = new commander.Command();
      program.argument('[arg]').hook('preAction', (thisCommand) => {
        assert.deepEqual(thisCommand.args, ['sub', 'value']);
      });
      program
        .command('sub')
        .argument('<arg>')
        .action(() => {});
      program.parse(['sub', 'value'], { from: 'user' });
    });

    test('when hook program on preAction and call sub then actionCommand has sub args set', () => {
      const program = new commander.Command();
      program.hook('preAction', (thisCommand, actionCommand) => {
        assert.deepEqual(actionCommand.args, ['value']);
      });
      program
        .command('sub')
        .argument('<arg>')
        .action(() => {});
      program.parse(['sub', 'value'], { from: 'user' });
    });
  });

  describe('action hooks async', () => {
    test('when async preAction then async from preAction', async () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', async () => {
          await 0;
          calls.push('before');
        })
        .action(() => calls.push('action'));
      const result = program.parseAsync([], { from: 'user' });
      assert.deepEqual(calls, []);
      await result;
      assert.deepEqual(calls, ['before', 'action']);
    });

    test('when async postAction then async from postAction', async () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('postAction', async () => {
          await 0;
          calls.push('after');
        })
        .action(() => calls.push('action'));
      const result = program.parseAsync([], { from: 'user' });
      assert.deepEqual(calls, ['action']);
      await result;
      assert.deepEqual(calls, ['action', 'after']);
    });

    test('when async action then async from action', async () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', () => calls.push('before'))
        .hook('postAction', () => calls.push('after'))
        .action(async () => {
          await 0;
          calls.push('action');
        });
      const result = program.parseAsync([], { from: 'user' });
      assert.deepEqual(calls, ['before']);
      await result;
      assert.deepEqual(calls, ['before', 'action', 'after']);
    });

    test('when async first preAction then async from first preAction', async () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', async () => {
          await 0;
          calls.push('1');
        })
        .hook('preAction', () => calls.push('2'))
        .action(() => calls.push('action'));
      const result = program.parseAsync([], { from: 'user' });
      assert.deepEqual(calls, []);
      await result;
      assert.deepEqual(calls, ['1', '2', 'action']);
    });

    test('when async second preAction then async from second preAction', async () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', () => calls.push('1'))
        .hook('preAction', async () => {
          await 0;
          calls.push('2');
        })
        .action(() => calls.push('action'));
      const result = program.parseAsync([], { from: 'user' });
      assert.deepEqual(calls, ['1']);
      await result;
      assert.deepEqual(calls, ['1', '2', 'action']);
    });

    test('when async hook everything then hooks called nested', async () => {
      const calls = [];
      const program = new commander.Command();
      program
        .hook('preAction', async () => {
          await 0;
          calls.push('pb1');
        })
        .hook('postAction', async () => {
          await 0;
          calls.push('pa1');
        });
      program
        .hook('preAction', async () => {
          await 0;
          calls.push('pb2');
        })
        .hook('postAction', async () => {
          await 0;
          calls.push('pa2');
        });
      program
        .command('sub')
        .hook('preAction', async () => {
          await 0;
          calls.push('sb');
        })
        .hook('postAction', async () => {
          await 0;
          calls.push('sa');
        })
        .action(async () => {
          await 0;
          calls.push('action');
        });
      const result = program.parseAsync(['sub'], { from: 'user' });
      assert.deepEqual(calls, []);
      await result;
      assert.deepEqual(calls, [
        'pb1',
        'pb2',
        'sb',
        'action',
        'sa',
        'pa2',
        'pa1',
      ]);
    });

    test('preSubcommand hook should work', async () => {
      const calls = [];
      const program = new commander.Command();
      program.hook('preSubcommand', async () => {
        await 0;
        calls.push(0);
      });
      program.command('sub').action(async () => {
        await 1;
        calls.push(1);
      });
      program.action(async () => {
        await 2;
        calls.push(2);
      });
      const result = program.parseAsync(['sub'], { from: 'user' });
      assert.deepEqual(calls, []);
      await result;
      assert.deepEqual(calls, [0, 1]);
    });
    test('preSubcommand hook should effective for direct subcommands', async () => {
      const calls = [];
      const program = new commander.Command();
      program.hook('preSubcommand', async (thisCommand, subCommand) => {
        await 'preSubcommand';
        calls.push('preSubcommand');
        calls.push(subCommand.name());
      });
      program
        .command('first')
        .action(async () => {
          await 'first';
          calls.push('first');
        })
        .command('second')
        .action(async () => {
          await 'second';
          calls.push('second');
        })
        .command('third')
        .action(async () => {
          await 'third';
          calls.push('third');
        });
      program.action(async () => {
        await 2;
        calls.push(2);
      });
      const result = program.parseAsync(['first', 'second', 'third'], {
        from: 'user',
      });
      assert.deepEqual(calls, []);
      await result;
      assert.deepEqual(calls, ['preSubcommand', 'first', 'third']);
    });
  });
});
