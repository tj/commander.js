const { Command } = require('../');
const { createTestCommand } = require('./testHelpers');
const { test, describe, before, afterEach, after } = require('node:test');
const assert = require('node:assert/strict');

describe('negative numbers in args', () => {
  // boolean is whether is a consumable argument when negative numbers allowed
  const negativeNumbers = [
    ['-.1', true],
    ['-123', true],
    ['-123.45', true],
    ['-1e3', true],
    ['-1e+3', true],
    ['-1e-3', true],
    ['-1.2e3', true],
    ['-1.2e+3', true],
    ['-1.2e-3', true],
    ['-1e-3.0', false], // invalid number format
    ['--1 ', false], // invalid number format
    ['-0', true],
    ['1', true],
    ['-1x', false], // whole string is not a number
    ['-x-1 ', false], // whole string is not a number
    ['', true],
    ['-0x1234', false], // not a plain number
  ];

  negativeNumbers.forEach(([value, consume]) => {
    function callProgram(program, args, consume) {
      if (consume) {
        assert.doesNotThrow(() => {
          program.parse(args, { from: 'user' });
        });
      } else {
        assert.throws(
          () => {
            program.parse(args, { from: 'user' });
          },
          { code: 'commander.unknownOption' },
        );
      }
    }
    test(`when option-argument for short optional is ${value} then consumed=${consume}`, () => {
      const program = createTestCommand();
      program.option('-o, --optional [value]', 'optional option');
      const args = ['-o', value];
      callProgram(program, args, consume);
      // throws after setting optional to true
      assert.equal(program.opts()['optional'], consume ? value : true);
    });

    test(`when option-argument for long optional is ${value} then consumed=${consume}`, () => {
      const program = createTestCommand();
      program.option('-o, --optional [value]', 'optional option');
      const args = ['--optional', value];
      callProgram(program, args, consume);
      // throws after setting optional to true
      assert.equal(program.opts()['optional'], consume ? value : true);
    });

    test(`when option-argument for short optional... is ${value} then consumed=${consume}`, () => {
      const program = createTestCommand();
      program.option('-o, --optional [value...]', 'optional option');
      const args = ['-o', 'first', value];
      callProgram(program, args, consume);
      // throws after consuming 'first'
      assert.deepEqual(
        program.opts()['optional'],
        consume ? ['first', value] : ['first'],
      );
    });

    test(`when option-argument for long optional... is ${value} then consumed=${consume}`, () => {
      const program = createTestCommand();
      program.option('-o, --optional [value...]', 'optional option');
      const args = ['--optional', 'first', value];
      callProgram(program, args, consume);
      // throws after consuming 'first'
      assert.deepEqual(
        program.opts()['optional'],
        consume ? ['first', value] : ['first'],
      );
    });

    test(`when command-argument is ${value} then consumed=${consume}`, () => {
      const program = createTestCommand();
      program.argument('<value>', 'argument');
      const args = [value];
      callProgram(program, args, consume);
      assert.deepEqual(
        consume ? program.args : undefined,
        consume ? [value] : undefined,
      );
    });

    test(`when digit option defined and option-argument is %s then negative not consumed`, () => {
      const program = createTestCommand();
      program
        .option('-o, --optional [value]', 'optional option')
        .option('-9', 'register option using digit');
      const args = ['-o', value];
      let customConsume = value[0] !== '-';
      callProgram(program, args, customConsume);
      assert.equal(program.opts()['optional'], customConsume ? value : true);
    });

    test(`when digit option defined and command-argument is %s then negative not consumed`, () => {
      const program = createTestCommand();
      program.argument('[value]').option('-9', 'register option using digit');
      const args = [value];
      let customConsume = value[0] !== '-';
      callProgram(program, args, customConsume);
      assert.deepEqual(
        customConsume ? program.args : undefined,
        customConsume ? [value] : undefined,
      );
    });
  });
});

test('when complex example with negative numbers then all consumed', () => {
  const program = new Command();
  program
    .option('-o [value]', 'optional')
    .option('-m <value>', 'required option-argument')
    .option('-O [value...]', 'optional')
    .option('-M <value...>', 'required option-argument')
    .argument('[value...]', 'argument');
  const args = [
    '-10',
    '-O',
    '-40',
    '-41',
    '-M',
    '-50',
    '-51',
    '-o',
    '-20',
    '-m',
    '-30',
    '-11',
  ];
  program.parse(args, { from: 'user' });
  assert.deepEqual(program.opts(), {
    o: '-20',
    m: '-30',
    O: ['-40', '-41'],
    M: ['-50', '-51'],
  });
  assert.deepEqual(program.args, ['-10', '-11']);
});

test('when program has digit option then negatives not allowed in leaf command', () => {
  const program = createTestCommand();
  program.option('-2', 'double option');
  let leafArgs;
  program
    .command('leaf')
    .argument('[value...]')
    .action((args) => {
      leafArgs = args;
    });
  const args = ['leaf', '-1'];
  assert.throws(() => program.parse(args, { from: 'user' }));
});

test('when default command without digit option then negatives accepted', () => {
  const program = new Command();
  let leafArgs;
  program
    .command('leaf', { isDefault: true })
    .argument('[value...]')
    .action((args) => {
      leafArgs = args;
    });
  program.parse(['-1'], { from: 'user' });
  assert.deepEqual(leafArgs, ['-1']);
});

test('when default command with digit option then negative throws', () => {
  const program = createTestCommand();
  program
    .command('leaf', { isDefault: true })
    .option('-2')
    .argument('[value...]')
    .action(() => {});
  assert.throws(() => program.parse(['-1'], { from: 'user' }));
});

test('when program has subcommand and action handler then negative command-argument unsupported', () => {
  // Known limitation in parsing. Only allowed negative command-arguments in leaf commands
  // to minimise changes to parsing when added support for negative numbers.
  const program = createTestCommand();
  program.argument('[value...]').action(() => {});
  program.command('leaf').action(() => {});
  assert.throws(() => program.parse(['-1'], { from: 'user' }));
});
