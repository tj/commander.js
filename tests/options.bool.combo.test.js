import * as commander from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Test combination of flag and --no-flag
// (single flags tested in options.bool.test.js)

describe('boolean option combos (--foo and --no-foo)', () => {
  // boolean option combo with no default
  describe('positive option with no default', () => {
    function createPepperProgram() {
      const program = new commander.Command();
      program
        .option('-p, --pepper', 'add pepper')
        .option('-P, --no-pepper', 'remove pepper');
      return program;
    }

    test('when option not specified then value is undefined', () => {
      const program = createPepperProgram();
      program.parse(['node', 'test']);
      assert.equal(program.opts().pepper, undefined);
    });

    test('when positive option then value is true', () => {
      const program = createPepperProgram();
      program.parse(['node', 'test', '--pepper']);
      assert.equal(program.opts().pepper, true);
    });

    test('when negative option then value is false', () => {
      const program = createPepperProgram();
      program.parse(['node', 'test', '--no-pepper']);
      assert.equal(program.opts().pepper, false);
    });

    test('when last option is positive then value is true', () => {
      const program = createPepperProgram();
      program.parse(['node', 'test', '--no-pepper', '--pepper']);
      assert.equal(program.opts().pepper, true);
    });

    test('when last option is negative then value is false', () => {
      const program = createPepperProgram();
      program.parse(['node', 'test', '--pepper', '--no-pepper']);
      assert.equal(program.opts().pepper, false);
    });
  });

  // Flag with default, say from an environment variable.

  function createPepperProgramWithDefault(defaultValue) {
    const program = new commander.Command();
    program
      .option('-p, --pepper', 'add pepper', defaultValue)
      .option('-P, --no-pepper', 'remove pepper');
    return program;
  }

  // boolean option combo, default true, long flags
  describe('option with default of true, long flags', () => {
    test('when option not specified then value is true', () => {
      const program = createPepperProgramWithDefault(true);
      program.parse(['node', 'test']);
      assert.equal(program.opts().pepper, true);
    });

    test('when positive option then value is true', () => {
      const program = createPepperProgramWithDefault(true);
      program.parse(['node', 'test', '--pepper']);
      assert.equal(program.opts().pepper, true);
    });

    test('when negative option then value is false', () => {
      const program = createPepperProgramWithDefault(true);
      program.parse(['node', 'test', '--no-pepper']);
      assert.equal(program.opts().pepper, false);
    });
  });

  // boolean option combo, default false, short flags
  describe('option with default of false, short flags', () => {
    test('when option not specified then value is false', () => {
      const program = createPepperProgramWithDefault(false);
      program.parse(['node', 'test']);
      assert.equal(program.opts().pepper, false);
    });

    test('when positive option then value is true', () => {
      const program = createPepperProgramWithDefault(false);
      program.parse(['node', 'test', '-p']);
      assert.equal(program.opts().pepper, true);
    });

    test('when negative option then value is false', () => {
      const program = createPepperProgramWithDefault(false);
      program.parse(['node', 'test', '-P']);
      assert.equal(program.opts().pepper, false);
    });
  });

  // boolean option combo with non-boolean default.
  // Changed behaviour to normal default in Commander 9.
  describe('option with non-boolean default', () => {
    test('when option not specified then value is default', () => {
      const program = createPepperProgramWithDefault('default');
      program.parse(['node', 'test']);
      assert.equal(program.opts().pepper, 'default');
    });

    test('when positive option then value is true', () => {
      const program = createPepperProgramWithDefault('default');
      program.parse(['node', 'test', '--pepper']);
      assert.equal(program.opts().pepper, true);
    });

    test('when negative option then value is false', () => {
      const program = createPepperProgramWithDefault('default');
      program.parse(['node', 'test', '--no-pepper']);
      assert.equal(program.opts().pepper, false);
    });
  });

  describe('option with non-boolean default and preset', () => {
    function createPepperProgramWithDefaultAndPreset() {
      const program = new commander.Command();
      program
        .addOption(
          new commander.Option('-p, --pepper')
            .default('default')
            .preset('preset'),
        )
        .option('-P, --no-pepper', 'remove pepper');
      return program;
    }

    test('when option not specified then value is default', () => {
      const program = createPepperProgramWithDefaultAndPreset();
      program.parse(['node', 'test']);
      assert.equal(program.opts().pepper, 'default');
    });

    test('when positive option then value is preset', () => {
      const program = createPepperProgramWithDefaultAndPreset();
      program.parse(['node', 'test', '--pepper']);
      assert.equal(program.opts().pepper, 'preset');
    });

    test('when negative option then value is false', () => {
      const program = createPepperProgramWithDefaultAndPreset();
      program.parse(['node', 'test', '--no-pepper']);
      assert.equal(program.opts().pepper, false);
    });
  });

  describe('only lone negative causes implicit default of true', () => {
    test('when lone negative then default value is true', () => {
      const program = new commander.Command();
      program.option('--no-pepper', 'remove pepper');
      program.parse([], { from: 'user' });
      assert.equal(program.opts().pepper, true);
    });

    test('when boolean combo and negative first then no implicit default', () => {
      // New behaviour in Commander 15, now only lone negative gets implicit default of true.
      const program = new commander.Command();
      program
        .option('--no-pepper', 'remove pepper')
        .option('--pepper', 'pepper only');
      program.parse([], { from: 'user' });
      assert.equal(program.opts().pepper, undefined);
    });

    test('when boolean combo and negative second then no implicit default', () => {
      const program = new commander.Command();
      program
        .option('--pepper', 'pepper only')
        .option('--no-pepper', 'remove pepper');
      program.parse([], { from: 'user' });
      assert.equal(program.opts().pepper, undefined);
    });

    test('when boolean combo and negative second with explicit default then get explicit default', () => {
      // Prior to Commander 15, negative second would ignore implicit and explicit default value.
      // Simpler rule now and the special default behaviour is for lone negative only. Add test since
      // intentional change of behaviour for unlikely edge case.
      const program = new commander.Command();
      program
        .option('--pepper', 'pepper only')
        .option('--no-pepper', 'remove pepper', 'plain');
      program.parse([], { from: 'user' });
      assert.equal(program.opts().pepper, 'plain');
    });
  });
});
