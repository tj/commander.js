const { Command } = require('../');

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

test.each(negativeNumbers)(
  `when option-argument for short optional is %s then consumed=%s`,
  (value, consume) => {
    const program = new Command();
    program.exitOverride().configureOutput({ writeErr: () => {} });
    program.option('-o, --optional [value]', 'optional option');
    const args = ['-o', value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    // throws after setting optional to true
    expect(program.opts()['optional']).toBe(consume ? value : true);
  },
);

test.each(negativeNumbers)(
  `when option-argument for long optional is %s then consumed=%s`,
  (value, consume) => {
    const program = new Command();
    program.exitOverride().configureOutput({ writeErr: () => {} });
    program.option('-o, --optional [value]', 'optional option');
    const args = ['--optional', value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    // throws after setting optional to true
    expect(program.opts()['optional']).toBe(consume ? value : true);
  },
);

test.each(negativeNumbers)(
  `when option-argument for short optional... is %s then consumed=%s`,
  (value, consume) => {
    const program = new Command();
    program
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .option('-o, --optional [value...]', 'optional option');
    const args = ['-o', 'first', value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    // throws after consuming 'first'
    expect(program.opts()['optional']).toEqual(
      consume ? ['first', value] : ['first'],
    );
  },
);

test.each(negativeNumbers)(
  `when option-argument for long optional... is %s then consumed=%s`,
  (value, consume) => {
    const program = new Command();
    program
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .option('-o, --optional [value...]', 'optional option');
    const args = ['--optional', 'first', value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    // throws after consuming 'first'
    expect(program.opts()['optional']).toEqual(
      consume ? ['first', value] : ['first'],
    );
  },
);

test.each(negativeNumbers)(
  `when command-argument is %s then consumed=%s`,
  (value, consume) => {
    const program = new Command();
    program
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .argument('<value>', 'argument');
    const args = [value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    expect(consume ? program.args : undefined).toEqual(
      consume ? [value] : undefined,
    );
  },
);

test.each(negativeNumbers)(
  `when digit option defined and option-argument is %s then negative not consumed`,
  (value, _ignore) => {
    const program = new Command();
    program
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .option('-o, --optional [value]', 'optional option')
      .option('-9', 'register option using digit');
    const args = ['-o', value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    let consume = value[0] !== '-';
    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    expect(program.opts()['optional']).toBe(consume ? value : true);
  },
);

test.each(negativeNumbers)(
  `when digit option defined and command-argument is %s then negative not consumed`,
  (value, _ignore) => {
    const program = new Command();
    program
      .exitOverride()
      .configureOutput({ writeErr: () => {} })
      .argument('[value]')
      .option('-9', 'register option using digit');
    const args = [value];
    let thrown = '';
    try {
      program.parse(args, { from: 'user' });
    } catch (err) {
      thrown = err.code;
    }

    let consume = value[0] !== '-';
    expect(thrown).toEqual(consume ? '' : 'commander.unknownOption');
    expect(consume ? program.args : undefined).toEqual(
      consume ? [value] : undefined,
    );
  },
);

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
  expect(program.opts()).toEqual({
    o: '-20',
    m: '-30',
    O: ['-40', '-41'],
    M: ['-50', '-51'],
  });
  expect(program.args).toEqual(['-10', '-11']);
});

test('when program has digit option then negatives not allowed in leaf command', () => {
  const program = new Command();
  program
    .exitOverride()
    .configureOutput({ writeErr: () => {} })
    .option('-2', 'double option');
  let leafArgs;
  program
    .command('leaf')
    .argument('[value...]')
    .action((args) => {
      leafArgs = args;
    });
  const args = ['leaf', '-1'];
  expect(() => program.parse(args, { from: 'user' })).toThrow();
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
  expect(leafArgs).toEqual(['-1']);
});

test('when default command with digit option then negative throws', () => {
  const program = new Command();
  program.exitOverride().configureOutput({ writeErr: () => {} });
  program
    .command('leaf', { isDefault: true })
    .option('-2')
    .argument('[value...]')
    .action(() => {});
  expect(() => program.parse(['-1'], { from: 'user' })).toThrow();
});

test('when program has subcommand and action handler then negative command-argument unsupported', () => {
  // Known limitation in parsing. Only allowed negative command-arguments in leaf commands
  // to minimise changes to parsing when added support for negative numbers.
  const program = new Command();
  program
    .exitOverride()
    .configureOutput({ writeErr: () => {} })
    .argument('[value...]')
    .action(() => {});
  program.command('leaf').action(() => {});
  expect(() => program.parse(['-1'], { from: 'user' })).toThrow();
});
