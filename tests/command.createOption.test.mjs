import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

class MyOption extends commander.Option {
  constructor(flags, description) {
    super(flags, description);
    this.myProperty = 'MyOption';
  }
}

class MyCommand extends commander.Command {
  createOption(flags, description) {
    return new MyOption(flags, description);
  }
}

describe('Command.createOption() override in subclass', () => {
  test('when override createOption then used for option()', () => {
    const program = new MyCommand();
    program.option('-a, --alpha');
    assert.equal(program.options.length, 1);
    assert.equal(program.options[0].myProperty, 'MyOption');
  });

  test('when override createOption then used for requiredOption()', () => {
    const program = new MyCommand();
    program.requiredOption('-a, --alpha');
    assert.equal(program.options.length, 1);
    assert.equal(program.options[0].myProperty, 'MyOption');
  });

  test('when override createOption then used for version()', () => {
    const program = new MyCommand();
    program.version('1.2.3');
    assert.equal(program.options.length, 1);
    assert.equal(program.options[0].myProperty, 'MyOption');
  });

  test('when override createOption then used for help option in visibleOptions', () => {
    const program = new MyCommand();
    const visibleOptions = program.createHelp().visibleOptions(program);
    assert.equal(visibleOptions.length, 1);
    assert.equal(visibleOptions[0].myProperty, 'MyOption');
  });
});
