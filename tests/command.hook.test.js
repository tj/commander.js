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
  program
    .hook('beforeAction', hook)
    .hook('afterAction', hook);
  program.parse([], { from: 'user' });
  expect(hook).not.toHaveBeenCalled();
});

describe('action hooks with synchronous hooks, order', () => {
  test('when hook beforeAction then hook called before action', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('beforeAction', () => calls.push('before'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['before', 'action']);
  });

  test('when hook afterAction then hook called after action', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('afterAction', () => calls.push('after'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['action', 'after']);
  });

  test('when hook beforeAction twice then hooks called FIFO', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('beforeAction', () => calls.push('1'))
      .hook('beforeAction', () => calls.push('2'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['1', '2', 'action']);
  });

  test('when hook afterAction twice then hooks called LIFO', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('afterAction', () => calls.push('1'))
      .hook('afterAction', () => calls.push('2'))
      .action(() => calls.push('action'));
    program.parse([], { from: 'user' });
    expect(calls).toEqual(['action', '2', '1']);
  });

  test('when hook beforeAction at program and sub then hooks called program then sub', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('beforeAction', () => calls.push('program'));
    program.command('sub')
      .hook('beforeAction', () => calls.push('sub'))
      .action(() => calls.push('action'));
    program.parse(['sub'], { from: 'user' });
    expect(calls).toEqual(['program', 'sub', 'action']);
  });

  test('when hook afterAction at program and sub then hooks called sub then program', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('afterAction', () => calls.push('program'));
    program.command('sub')
      .hook('afterAction', () => calls.push('sub'))
      .action(() => calls.push('action'));
    program.parse(['sub'], { from: 'user' });
    expect(calls).toEqual(['action', 'sub', 'program']);
  });

  test('when hook everything then hooks called nested', () => {
    const calls = [];
    const program = new commander.Command();
    program
      .hook('beforeAction', () => calls.push('pb1'))
      .hook('afterAction', () => calls.push('pa1'));
    program
      .hook('beforeAction', () => calls.push('pb2'))
      .hook('afterAction', () => calls.push('pa2'));
    program.command('sub')
      .hook('beforeAction', () => calls.push('sb'))
      .hook('afterAction', () => calls.push('sa'))
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
      .hook('beforeAction', hook)
      .action(() => {});
    program.parse([], { from: 'user' });
    expect(hook).toHaveBeenCalledWith({ command: program, hookedCommand: program });
  });

  test('when hook on program and call sub then context is sub/program', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    program
      .hook('beforeAction', hook);
    const sub = program.command('sub')
      .action(() => {});
    program.parse(['sub'], { from: 'user' });
    expect(hook).toHaveBeenCalledWith({ command: sub, hookedCommand: program });
  });

  test('when hook on sub and call sub then context is sub/sub', () => {
    const hook = jest.fn();
    const program = new commander.Command();
    const sub = program.command('sub')
      .hook('beforeAction', hook)
      .action(() => {});
    program.parse(['sub'], { from: 'user' });
    expect(hook).toHaveBeenCalledWith({ command: sub, hookedCommand: sub });
  });
});
