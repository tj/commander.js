const commander = require('../');

// Test some behaviours of .action not covered in more specific tests.

describe('with action', () => {
  test('when .action called then builder action is executed', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program.command('run', 'run description', {
      action: actionOptions => {
        return actionOptions
          .command
          .command('run')
          .action(actionMock)
          .parseCommand(actionOptions.operands, actionOptions.unknown);
      }
    });
    program.parse(['node', 'test', 'run']);
    expect(actionMock).toHaveBeenCalled();
  });

  test('when .action called action is executed', () => {
    const actionMock = jest.fn();
    const program = new commander.Command();
    program.command('run', 'run description', {
      action: actionOptions => {
        return Promise.resolve(actionOptions
          .command
          .command('run')
          .action(actionMock)
          .parseCommand(actionOptions.operands, actionOptions.unknown));
      }
    });
    return program.parseAsync(['node', 'test', 'run']).then(() => {
      expect(actionMock).toHaveBeenCalled();
    });
  });

  test('arguments is resolved and passed to action', () => {
    const actionSpy = jest.fn();
    return new commander.Command()
      .command('run <action>', 'run description', {
        action: actionOptions => {
          return Promise.resolve(actionOptions
            .command
            .command('run <arg>')
            .action((arg) => {
              expect(arg).toEqual('foo');
              actionSpy();
            })
            .parseCommand(actionOptions.operands, actionOptions.unknown));
        }
      })
      .parseAsync(['node', 'test', 'run', 'foo']).then(() => {
        expect(actionSpy).toHaveBeenCalled();
      });
  });

  test('options is resolved and passed to action', () => {
    const actionSpy = jest.fn();
    return new commander.Command()
      .command('run <action>', 'run description', {
        action: actionOptions => {
          return Promise.resolve(actionOptions
            .command
            .command('run')
            .requiredOption('--test-option <val>', 'test value')
            .action(command => {
              expect(command.testOption).toEqual('bar');
              actionSpy();
            })
            .parseCommand(actionOptions.operands, actionOptions.unknown)
          );
        }
      })
      .parseAsync(['node', 'test', 'run', '--test-option', 'bar']).then(() => {
        expect(actionSpy).toHaveBeenCalled();
      });
  });

  test('recursive sub command action', () => {
    const infoSpy = jest.fn();
    const runSpy = jest.fn();
    const runCommandBuilder = actionOptions => {
      return actionOptions.command.command('run <action>', 'run description', {
        action: _actionOptions => {
          if (_actionOptions.operands && _actionOptions.operands[0] === 'run') {
            runSpy();
            return runCommandBuilder(_actionOptions)
              .parseCommand(_actionOptions.operands, _actionOptions.unknown);
          }
          return Promise.resolve(actionOptions
            .command
            .command('info')
            .action(infoSpy)
            .parseCommand(actionOptions.operands, actionOptions.unknown)
          );
        }
      });
    };
    return runCommandBuilder({ command: new commander.Command() })
      .parseAsync(['node', 'test', 'run', 'run', 'run', 'run', 'info']).then(() => {
        expect(infoSpy).toHaveBeenCalled();
        expect(runSpy).toHaveBeenCalledTimes(3);
      })
    ;
  });
});
