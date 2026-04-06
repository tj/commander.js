import { expectType } from 'tsd';
import commander from '../';

describe('program with plugins', () => {
  test('plugin that extends command, no return', () => {
    function pluginExtendCommand(command: commander.Command) {
      Object.assign(command, {
        foo: () => 'Hello World',
      });
    }

    const program = new commander.Command();

    const result = program.register(pluginExtendCommand);

    expectType<typeof program>(result);

    expect(result).toEqual(result); // should be the same instance

    expect(result).toHaveProperty('foo'); // should have new properties
    expect(result).toHaveProperty('name'); // should have existing properties
    expect((result as commander.Command & { foo(): string }).foo()).toEqual(
      'Hello World',
    );
  });

  test('plugin that extends command, return, same instance', () => {
    function pluginExtendCommand(command: commander.Command) {
      return Object.assign(command, {
        foo: () => 'Hello World',
      });
    }

    const program = new commander.Command();

    const result = program.register(pluginExtendCommand);

    expectType<typeof program & { foo(): string }>(result);

    expect(result).toEqual(result); // should be the same instance

    expect(result).toHaveProperty('foo'); // should have new properties
    expect(result).toHaveProperty('name'); // should have existing properties
    expect(result.foo()).toEqual('Hello World');
  });
});
