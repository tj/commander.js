const commander = require('../');

// Test the ways values can be specified for options

// option with required value
describe('option with required value', () => {
  function createPortProgram() {
    const program = new commander.Command();
    program
      .option('-p,--port <number>', 'specify port')
    return program;
  }

  test('when short flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p 80'.split(' '));
    expect(program.port).toBe('80');
  });

  test('when short flag concatenated with number then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p80'.split(' '));
    expect(program.port).toBe('80');
  });

  test('when short flag concatenated with string then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -pLOOPBACK'.split(' '));
    expect(program.port).toBe('LOOPBACK');
  });

  test('when long flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port 80'.split(' '));
    expect(program.port).toBe('80');
  });

  test('when long flag = value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port=80'.split(' '));
    expect(program.port).toBe('80');
  });
});

// Major repetition, but keep it simple
//
// option with optional value
describe('option with optional value', () => {
  function createPortProgram() {
    const program = new commander.Command();
    program
      .option('-p,--port [number]', 'specify port')
    return program;
  }

  test('when short flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p 80'.split(' '));
    expect(program.port).toBe('80');
  });

  test('when short flag concatenated with number then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -p80'.split(' '));
    expect(program.port).toBe('80');
  });

  test('when short flag concatenated with string then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test -pLOOPBACK'.split(' '));
    expect(program.port).toBe('LOOPBACK');
  });

  test('when long flag followed by value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port 80'.split(' '));
    expect(program.port).toBe('80');
  });

  test('when long flag = value then value is as specified', () => {
    const program = createPortProgram();
    program.parse('node test --port=80'.split(' '));
    expect(program.port).toBe('80');
  });
});
