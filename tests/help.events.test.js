const commander = require('../');

// Using .outputHelp more than .help, since don't need to avoid process.exit if tests go wrong.
// Assuming .help calls .outputHelp so not testing separately.

describe('listeners for "help" and "groupHelp"', () => {
  let writeSpy;

  beforeAll(() => {
    writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
  });

  afterEach(() => {
    writeSpy.mockClear();
  });

  afterAll(() => {
    writeSpy.mockRestore();
  });

  test('when no listener then default help implementation', () => {
    const program = new commander.Command();
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledWith(program.helpInformation());
    writeSpy.mockClear();
  });

  test('when on("help") then just "help"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    program
      .on('help', customHelp);
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });

  test('when on("groupHelp") then just "groupHelp"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    program
      .on('groupHelp', customHelp);
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });

  test('when on("groupHelp") and subcommand help then just "groupHelp"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    program
      .exitOverride()
      .on('groupHelp', customHelp)
      .command('sub');
    expect(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    }).toThrow('(outputHelp)');
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });

  test('when on("help") and on("groupHelp") then just "help"', () => {
    const program = new commander.Command();
    const customHelp = jest.fn();
    const customGroupHelp = jest.fn();
    program
      .on('help', customHelp)
      .on('groupHelp', customGroupHelp);
    program.outputHelp();
    expect(writeSpy).toHaveBeenCalledTimes(0);
    expect(customGroupHelp).toHaveBeenCalledTimes(0);
    expect(customHelp).toHaveBeenCalledTimes(1);
    writeSpy.mockClear();
  });
});

test('when listen to lots then emitted in order"', () => {
  const program = new commander.Command();
  const eventsOrder = [];
  // Mix up the order added
  program
    .on('postGroupHelp', () => eventsOrder.push('postGroupHelp'))
    .on('preGroupHelp', () => eventsOrder.push('preGroupHelp'))
    .on('preHelp', () => eventsOrder.push('preHelp'))
    .on('postHelp', () => eventsOrder.push('postHelp'))
    .on('help', () => eventsOrder.push('help'));
  program.outputHelp();
  expect(eventsOrder).toEqual(['preGroupHelp', 'preHelp', 'help', 'postHelp', 'postGroupHelp']);
});

describe('event context', () => {
  test('when error:undefined then write is stdout.write', () => {
    const writeSpy = jest.spyOn(process.stdout, 'write').mockImplementation(() => { });
    const program = new commander.Command();
    program
      .on('help', (context) => context.write('test'))
      .outputHelp();
    expect(writeSpy).toHaveBeenCalledWith('test');
    writeSpy.mockClear();
  });

  test('when error:true then write is stderr.write', () => {
    const writeSpy = jest.spyOn(process.stderr, 'write').mockImplementation(() => { });
    const program = new commander.Command();
    program
      .on('help', (context) => context.write('test'))
      .outputHelp({ error: true });
    expect(writeSpy).toHaveBeenCalledWith('test');
    writeSpy.mockClear();
  });

  test('when error:undefined then log is console.log', () => {
    const logSpy = jest.spyOn(console, 'log').mockImplementation(() => { });
    const program = new commander.Command();
    program
      .on('help', (context) => context.log('test'))
      .outputHelp();
    expect(logSpy).toHaveBeenCalledWith('test');
    logSpy.mockClear();
  });

  test('when error:true then log is console.error', () => {
    const logSpy = jest.spyOn(console, 'error').mockImplementation(() => { });
    const program = new commander.Command();
    program
      .on('help', (context) => context.log('test'))
      .outputHelp({ error: true });
    expect(logSpy).toHaveBeenCalledWith('test');
    logSpy.mockClear();
  });

  test('when help called on program then context.command for groupHelp is program', () => {
    let contextCommand;
    const program = new commander.Command();
    program
      .on('groupHelp', (context) => { contextCommand = context.command; })
      .outputHelp();
    expect(contextCommand).toBe(program);
  });

  test('when help called on subcommand then context.command for groupHelp is subcommand', () => {
    let contextCommand;
    const program = new commander.Command();
    program
      .exitOverride()
      .on('groupHelp', (context) => { contextCommand = context.command; });
    const sub = program.command('sub');
    expect(() => {
      program.parse(['sub', '--help'], { from: 'user' });
    }).toThrow('(outputHelp)');
    expect(contextCommand).toBe(sub);
  });
});
