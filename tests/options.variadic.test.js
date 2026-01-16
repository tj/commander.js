import * as commander from '../index.js';
import { createTestCommand } from './testHelpers.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

describe('variadic options', () => {
  describe('variadic option with required option-argument', () => {
    test('when variadic with value missing then error', () => {
      const program = createTestCommand();
      program.option('-r,--required <value...>');

      assert.throws(() => {
        program.parse(['--required'], { from: 'user' });
      });
    });

    test('when variadic with one value then set in array', () => {
      const program = new commander.Command();
      program.option('-r,--required <value...>');

      program.parse(['--required', 'one'], { from: 'user' });
      assert.deepEqual(program.opts().required, ['one']);
    });

    test('when variadic with two values then set in array', () => {
      const program = new commander.Command();
      program.option('-r,--required <value...>');

      program.parse(['--required', 'one', 'two'], { from: 'user' });
      assert.deepEqual(program.opts().required, ['one', 'two']);
    });

    test('when variadic with repeated values then set in array', () => {
      const program = new commander.Command();
      program.option('-r,--required <value...>');

      program.parse(['--required', 'one', '--required', 'two'], {
        from: 'user',
      });
      assert.deepEqual(program.opts().required, ['one', 'two']);
    });

    test('when variadic used with choices and one value then set in array', () => {
      const program = new commander.Command();
      program.addOption(
        new commander.Option('-r,--required <value...>').choices([
          'one',
          'two',
        ]),
      );

      program.parse(['--required', 'one'], { from: 'user' });
      assert.deepEqual(program.opts().required, ['one']);
    });

    test('when variadic used with choices and two values then set in array', () => {
      const program = new commander.Command();
      program.addOption(
        new commander.Option('-r,--required <value...>').choices([
          'one',
          'two',
        ]),
      );

      program.parse(['--required', 'one', 'two'], { from: 'user' });
      assert.deepEqual(program.opts().required, ['one', 'two']);
    });

    test('when variadic with short combined argument then not variadic', () => {
      const program = new commander.Command();
      program.option('-r,--required <value...>').argument('[arg]');

      program.parse(['-rone', 'operand'], { from: 'user' });
      assert.deepEqual(program.opts().required, ['one']);
    });

    test('when variadic with long combined argument then not variadic', () => {
      const program = new commander.Command();
      program.option('-r,--required <value...>').argument('[arg]');

      program.parse(['--required=one', 'operand'], { from: 'user' });
      assert.deepEqual(program.opts().required, ['one']);
    });

    test('when variadic with value followed by option then option not eaten', () => {
      const program = new commander.Command();
      program
        .option('-r,--required <value...>')
        .option('-f, --flag')
        .argument('[arg]');

      program.parse(['-r', 'one', '-f'], { from: 'user' });
      const opts = program.opts();
      assert.deepEqual(opts.required, ['one']);
      assert.equal(opts.flag, true);
    });

    test('when variadic with no value and default then set to default', () => {
      const program = new commander.Command();
      program.option(
        '-r,--required <value...>',
        'variadic description',
        'default',
      );

      program.parse([], { from: 'user' });
      assert.equal(program.opts().required, 'default');
    });

    test('when variadic with coercion then coercion sets value', () => {
      const program = new commander.Command();
      program.option(
        '-r,--required <value...>',
        'variadic description',
        parseFloat,
      );

      // variadic processing reads the multiple values, but up to custom coercion what it does.
      program.parse(['--required', '1e2', '1e3'], { from: 'user' });
      assert.equal(program.opts().required, 1000);
    });
  });

  // Not retesting everything, but do some tests on variadic with optional
  describe('variadic option with optional option-argument', () => {
    test('when variadic not specified then value undefined', () => {
      const program = new commander.Command();
      program.option('-o,--optional [value...]');

      program.parse([], { from: 'user' });
      assert.equal(program.opts().optional, undefined);
    });

    test('when variadic used as boolean flag then value true', () => {
      const program = new commander.Command();
      program.option('-o,--optional [value...]');

      program.parse(['--optional'], { from: 'user' });
      assert.equal(program.opts().optional, true);
    });

    test('when variadic with one value then set in array', () => {
      const program = new commander.Command();
      program.option('-o,--optional [value...]');

      program.parse(['--optional', 'one'], { from: 'user' });
      assert.deepEqual(program.opts().optional, ['one']);
    });

    test('when variadic with two values then set in array', () => {
      const program = new commander.Command();
      program.option('-o,--optional [value...]');

      program.parse(['--optional', 'one', 'two'], { from: 'user' });
      assert.deepEqual(program.opts().optional, ['one', 'two']);
    });
  });

  describe('variadic special cases', () => {
    test('when option flags has word character before dots then is variadic', () => {
      const program = new commander.Command();
      program.option('-c,--comma [value...]');

      assert.equal(program.options[0].variadic, true);
    });

    test('when option flags has special characters before dots then not variadic', () => {
      // This might be used to describe coercion for comma separated values, and is not variadic.
      const program = new commander.Command();
      program.option('-c,--comma [value,...]');

      assert.equal(program.options[0].variadic, false);
    });
  });
});
