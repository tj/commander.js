const commander = require('../');

test('when hook event wrong then throw', () => {
  const program = new commander.Command();
  expect(() => {
    program.hook('silly', () => {});
  }).toThrow();
});

test('when no action then action hooks not called', () => {
  const hook = jest.fn();
  const program = new commander.Command();
  program.hook('preAction', hook).hook('postAction', hook);
  program.parse([], { from: 'user' });
  expect(hook).not.toHaveBeenCalled();
});

describe('action hooks with synchronous hooks, order', () => {
  test('when hook preAction then hook called before action', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('preAction', () => calls.push('before'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['before', 'action']);
  });

  test('when hook postAction then hook called after action', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('postAction', () => calls.push('after'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['action', 'after']);
  });

  test('when hook preAction twice then hooks called FIFO', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('preAction', () => calls.push('1'))
      .hook('preAction', () => calls.push('2'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['1', '2', 'action']);
  });

  test('when hook postAction twice then hooks called LIFO', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('postAction', () => calls.push('1'))
      .hook('postAction', () => calls.push('2'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['action', '2', '1']);
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
    expect(calls).toEqual(['program', 'sub', 'action']);
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
    expect(calls).toEqual(['action', 'sub', 'program']);
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
    expect(calls).toEqual(['pb1', 'pb2', 'sb', 'action', 'sa', 'pa2', 'pa1']);
  });
});

describe('action hooks context', () => {
  test('when hook on program then passed program/program', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    program.hook('preAction', hook).action(() => {});
    program.parse([], { from: 'user' });
    expect(hook).toHaveBeenCalledWith(program, program);
  });

  test('when hook on program and call sub then passed program/sub', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    program.hook('preAction', hook);
    const sub = program.command('sub').action(() => {});
    program.parse(['sub'], { from: 'user' });
    expect(hook).toHaveBeenCalledWith(program, sub);
  });

  test('when hook on sub and call sub then passed sub/sub', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    const sub = program
      .command('sub')
      .hook('preAction', hook)
      .action(() => {});
    program.parse(['sub'], { from: 'user' });
    expect(hook).toHaveBeenCalledWith(sub, sub);
  });

  test('when hook program on preAction then thisCommand has options set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .option('--debug')
      .hook('preAction', (thisCommand) => {
        expect(thisCommand.opts().debug).toEqual(true);
      })
      .action(() => {});
    program.parse(['--debug'], { from: 'user' });
  });

  test('when hook program on preAction and call sub then thisCommand has program options set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program.option('--debug').hook('preAction', (thisCommand) => {
      expect(thisCommand.opts().debug).toEqual(true);
    });
    program.command('sub').action(() => {});
    program.parse(['sub', '--debug'], { from: 'user' });
  });

  test('when hook program on preAction and call sub then actionCommand has sub options set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program.hook('preAction', (thisCommand, actionCommand) => {
      expect(actionCommand.opts().debug).toEqual(true);
    });
    program
      .command('sub')
      .option('--debug')
      .action(() => {});
    program.parse(['sub', '--debug'], { from: 'user' });
  });

  test('when hook program on preAction then actionCommand has args set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .argument('[arg]')
      .hook('preAction', (thisCommand, actionCommand) => {
        expect(actionCommand.args).toEqual(['value']);
      })
      .action(() => {});
    program.parse(['value'], { from: 'user' });
  });

  test('when hook program on preAction then actionCommand has args set with options removed', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .argument('[arg]')
      .option('--debug')
      .hook('preAction', (thisCommand, actionCommand) => {
        expect(actionCommand.args).toEqual(['value']);
      })
      .action(() => {});
    program.parse(['value', '--debug'], { from: 'user' });
  });

  test('when hook program on preAction and call sub then thisCommand has program args set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program.argument('[arg]').hook('preAction', (thisCommand) => {
      expect(thisCommand.args).toEqual(['sub', 'value']);
    });
    program
      .command('sub')
      .argument('<arg>')
      .action(() => {});
    program.parse(['sub', 'value'], { from: 'user' });
  });

  test('when hook program on preAction and call sub then actionCommand has sub args set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program.hook('preAction', (thisCommand, actionCommand) => {
      expect(actionCommand.args).toEqual(['value']);
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
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['before', 'action']);
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
    expect(calls).toEqual(['action']);
    await result;
    expect(calls).toEqual(['action', 'after']);
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
    expect(calls).toEqual(['before']);
    await result;
    expect(calls).toEqual(['before', 'action', 'after']);
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
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['1', '2', 'action']);
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
    expect(calls).toEqual(['1']);
    await result;
    expect(calls).toEqual(['1', '2', 'action']);
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
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['pb1', 'pb2', 'sb', 'action', 'sa', 'pa2', 'pa1']);
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
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual([0, 1]);
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
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['preSubcommand', 'first', 'third']);
  });
});
