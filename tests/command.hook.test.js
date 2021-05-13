const commander = require('../');

test('when no action then action hooks not called', () => {
  const hook = jest.fn();
  const program = new commander.Command();
  program
    .beforeAction(hook)
    .afterAction(hook);
  program.parse([], { from: 'user' });
  expect(hook).not.toHaveBeenCalled();
});

describe('action hooks with synchronous hooks, order', () => {
  test('when hook beforeAction then hook called before action', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(() => calls.push('before'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['before', 'action']);
  });

  test('when hook afterAction then hook called after action', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .afterAction(() => calls.push('after'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['action', 'after']);
  });

  test('when hook beforeAction twice then hooks called FIFO', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(() => calls.push('1'))
      .beforeAction(() => calls.push('2'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['1', '2', 'action']);
  });

  test('when hook afterAction twice then hooks called LIFO', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .afterAction(() => calls.push('1'))
      .afterAction(() => calls.push('2'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['action', '2', '1']);
  });

  test('when hook beforeAction at program and sub then hooks called program then sub', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(() => calls.push('program'));
    program.command('sub')
      .beforeAction(() => calls.push('sub'))
      .action(() => calls.push('action'));
    program.parse(['sub'], { from: 'user' });
    expect(calls).toEqual(['program', 'sub', 'action']);
  });

  test('when hook afterAction at program and sub then hooks called sub then program', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .afterAction(() => calls.push('program'));
    program.command('sub')
      .afterAction(() => calls.push('sub'))
      .action(() => calls.push('action'));
    program.parse(['sub'], { from: 'user' });
    expect(calls).toEqual(['action', 'sub', 'program']);
  });

  test('when hook everything then hooks called nested', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(() => calls.push('pb1'))
      .afterAction(() => calls.push('pa1'));
    program
      .beforeAction(() => calls.push('pb2'))
      .afterAction(() => calls.push('pa2'));
    program.command('sub')
      .beforeAction(() => calls.push('sb'))
      .afterAction(() => calls.push('sa'))
      .action(() => calls.push('action'));
    program.parse(['sub'], { from: 'user' });
    expect(calls).toEqual(['pb1', 'pb2', 'sb', 'action', 'sa', 'pa2', 'pa1']);
  });
});

describe('action hooks context', () => {
  test('when hook on program then context is program/program', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    program
      .beforeAction(hook)
      .action(() => {});
    program.parse([], { from: 'user' });
    expect(hook).toHaveBeenCalledWith(program, program);
  });

  test('when hook on program and call sub then context is sub/program', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    program
      .beforeAction(hook);
    const sub = program.command('sub')
      .action(() => {});
    program.parse(['sub'], { from: 'user' });
    expect(hook).toHaveBeenCalledWith(program, sub);
  });

  test('when hook on sub and call sub then context is sub/sub', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    const sub = program.command('sub')
      .beforeAction(hook)
      .action(() => {});
    program.parse(['sub'], { from: 'user' });
    expect(hook).toHaveBeenCalledWith(sub, sub);
  });

  test('when hook program on beforeAction then thisCommand has options set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .option('--debug')
      .beforeAction((thisCommand) => {
        expect(thisCommand.opts().debug).toEqual(true);
      })
      .action(() => {});
    program.parse(['--debug'], { from: 'user' });
  });

  test('when hook program on beforeAction and call sub then thisCommand has program options set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .option('--debug')
      .beforeAction((thisCommand) => {
        expect(thisCommand.opts().debug).toEqual(true);
      });
    program.command('sub')
      .action(() => {});
    program.parse(['sub', '--debug'], { from: 'user' });
  });

  test('when hook program on beforeAction and call sub then actionCommand has sub options set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .beforeAction((thisCommand, actionCommand) => {
        expect(actionCommand.opts().debug).toEqual(true);
      });
    program.command('sub')
      .option('--debug')
      .action(() => {});
    program.parse(['sub', '--debug'], { from: 'user' });
  });

  test('when hook program on beforeAction then actionCommand has args set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .argument('[arg]')
      .beforeAction((thisCommand, actionCommand) => {
        expect(actionCommand.args).toEqual(['value']);
      })
      .action(() => {});
    program.parse(['value'], { from: 'user' });
  });

  test('when hook program on beforeAction then actionCommand has args set with options removed', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .argument('[arg]')
      .option('--debug')
      .beforeAction((thisCommand, actionCommand) => {
        expect(actionCommand.args).toEqual(['value']);
      })
      .action(() => {});
    program.parse(['value', '--debug'], { from: 'user' });
  });

  test('when hook program on beforeAction and call sub then thisCommand has program args set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .argument('[arg]')
      .beforeAction((thisCommand, actionCommand) => {
        expect(thisCommand.args).toEqual(['sub', 'value']);
      });
    program.command('sub')
      .action(() => {});
    program.parse(['sub', 'value'], { from: 'user' });
  });

  test('when hook program on beforeAction and call sub then actionCommand has sub args set', () => {
    expect.assertions(1);
    const program = new commander.Command();
    program
      .beforeAction((thisCommand, actionCommand) => {
        expect(actionCommand.args).toEqual(['value']);
      });
    program.command('sub')
      .action(() => {});
    program.parse(['sub', 'value'], { from: 'user' });
  });
});

describe('action hooks async', () => {
  test('when async beforeAction then async from beforeAction', async() => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(async() => {
        await 0;
        calls.push('before');
      })
      .action(() => calls.push('action'));
    const result = program.parseAsync([], { from: 'user' });
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['before', 'action']);
  });

  test('when async afterAction then async from afterAction', async() => {
    const calls = [];
    const program = new commander.Command();
    program
      .afterAction(async() => {
        await 0;
        calls.push('after');
      })
      .action(() => calls.push('action'));
    const result = program.parseAsync([], { from: 'user' });
    expect(calls).toEqual(['action']);
    await result;
    expect(calls).toEqual(['action', 'after']);
  });

  test('when async action then async from action', async() => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(() => calls.push('before'))
      .afterAction(() => calls.push('after'))
      .action(async() => {
        await 0;
        calls.push('action');
      });
    const result = program.parseAsync([], { from: 'user' });
    expect(calls).toEqual(['before']);
    await result;
    expect(calls).toEqual(['before', 'action', 'after']);
  });

  test('when async first beforeAction then async from first beforeAction', async() => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(async() => {
        await 0;
        calls.push('1');
      })
      .beforeAction(() => calls.push('2'))
      .action(() => calls.push('action'));
    const result = program.parseAsync([], { from: 'user' });
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['1', '2', 'action']);
  });

  test('when async second beforeAction then async from second beforeAction', async() => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(() => calls.push('1'))
      .beforeAction(async() => {
        await 0;
        calls.push('2');
      })
      .action(() => calls.push('action'));
    const result = program.parseAsync([], { from: 'user' });
    expect(calls).toEqual(['1']);
    await result;
    expect(calls).toEqual(['1', '2', 'action']);
  });

  test('when async hook everything then hooks called nested', async() => {
    const calls = [];
    const program = new commander.Command();
    program
      .beforeAction(async() => { await 0; calls.push('pb1'); })
      .afterAction(async() => { await 0; calls.push('pa1'); });
    program
      .beforeAction(async() => { await 0; calls.push('pb2'); })
      .afterAction(async() => { await 0; calls.push('pa2'); });
    program.command('sub')
      .beforeAction(async() => { await 0; calls.push('sb'); })
      .afterAction(async() => { await 0; calls.push('sa'); })
      .action(async() => { await 0; calls.push('action'); });
    const result = program.parseAsync(['sub'], { from: 'user' });
    expect(calls).toEqual([]);
    await result;
    expect(calls).toEqual(['pb1', 'pb2', 'sb', 'action', 'sa', 'pa2', 'pa1']);
  });
});
