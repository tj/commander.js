const { Option, Command } = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');
const { createTestCommand } = require('./testHelpers');

describe('Option.setAttributeName()', () => {
  test('when .setAttributeName(foo) then overrides default camelcase', () => {
    const option = new Option('--use-mcp-server');
    option.setAttributeName('useMCPServer');
    assert.equal(option.attributeName(), 'useMCPServer');
  });

  test('when .setAttributeName(foo) on negated option then overrides default camelcase', () => {
    const option = new Option('--no-my-special-option');
    option.setAttributeName('myCustomAttribute');
    assert.equal(option.attributeName(), 'myCustomAttribute');
  });

  test('when .setAttributeName(foo) on lone short flag then overrides default attribute name', () => {
    const option = new Option('-e');
    option.setAttributeName('example');
    assert.equal(option.attributeName(), 'example');
  });

  test('when .setAttributeName(foo) on boolean option then custom attribute name is used with option value', () => {
    const program = new Command();
    program.addOption(
      new Option('--use-mcp-server').setAttributeName('useMCPServer'),
    );
    program.parse(['--use-mcp-server'], { from: 'user' });
    assert.equal(program.opts().useMCPServer, true);
  });

  test('when .setAttributeName(foo) on option with value then custom attribute name is used with specified option value', () => {
    const program = new Command();
    program.addOption(
      new Option('--baud <value>').setAttributeName('baudrate'),
    );
    program.parse(['--baud', '9600'], { from: 'user' });
    assert.equal(program.opts().baudrate, '9600');
  });

  test('when .setAttributeName(foo) on negated option then custom attribute name is used with default option value', () => {
    const program = new Command();
    program.addOption(new Option('--no-port').setAttributeName('commPort'));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().commPort, true);
  });

  test('when .setAttributeName(foo) on negated option then custom attribute name is used when option specified', () => {
    const program = new Command();
    program.addOption(new Option('--no-port').setAttributeName('commPort'));
    program.parse(['--no-port'], { from: 'user' });
    assert.equal(program.opts().commPort, false);
  });

  test('when .setAttributeName(foo) on combo option then positive option stored with custom attribute name', () => {
    const program = new Command();
    program
      .addOption(new Option('--port <number>').setAttributeName('commPort'))
      .addOption(new Option('--no-port').setAttributeName('commPort'));
    program.parse(['--port', '9600'], { from: 'user' });
    assert.equal(program.opts().commPort, '9600');
  });

  test('when .setAttributeName(foo) on combo option then negated option stored with custom attribute name', () => {
    const program = new Command();
    program
      .addOption(new Option('--port <number>').setAttributeName('commPort'))
      .addOption(new Option('--no-port').setAttributeName('commPort'));
    program.parse(['--no-port'], { from: 'user' });
    assert.equal(program.opts().commPort, false);
  });

  test('when .setAttributeName(foo) on combo option then no default value', () => {
    const program = new Command();
    program
      .addOption(new Option('--port').setAttributeName('commPort'))
      .addOption(new Option('--no-port').setAttributeName('commPort'));
    program.parse([], { from: 'user' });
    assert.equal(program.opts().commPort, undefined);
  });

  test('when .setAttributeName(foo) and value implied then see implied value', () => {
    // The baud option is not actually needed, but check behaviour in case changes in future.
    const program = new Command();
    program
      .addOption(new Option('--baud <rate>').setAttributeName('baudRate'))
      .addOption(new Option('--speedy').implies({ baudRate: '19200' }));
    program.parse(['--speedy'], { from: 'user' });
    assert.equal(program.opts().speedy, true);
    assert.equal(program.opts().baudRate, '19200');
  });

  test('when .setAttributeName(foo) and implies value then custom attribute name is used for option and triggers implies', () => {
    const program = new Command();
    program
      .addOption(
        new Option('--baud <rate>')
          .setAttributeName('baudRate')
          .implies({ speed: 'known' }),
      )
      .option('--speed <str>');
    program.parse(['--baud', '9600'], { from: 'user' });
    assert.equal(program.opts().baudRate, '9600');
    assert.equal(program.opts().speed, 'known');
  });

  test('when a.setAttributeName(foo) and b.conflicts(foo) then conflict detected', () => {
    const program = createTestCommand();
    program
      .addOption(new Option('--baud <rate>').setAttributeName('baudRate'))
      .addOption(new Option('--slow').conflicts('baudRate'));
    assert.throws(
      () => {
        program.parse(['--baud', '9600', '--slow'], { from: 'user' });
      },
      { code: 'commander.conflictingOption' },
    );
  });

  test('when .setAttributeName(foo) and mandatory option then supplied is ok', () => {
    const program = createTestCommand();
    program.addOption(
      new Option('--baud <rate>')
        .setAttributeName('baudRate')
        .makeOptionMandatory(),
    );
    assert.doesNotThrow(() => {
      program.parse(['--baud', '9600'], { from: 'user' });
    });
    assert.equal(program.opts().baudRate, '9600');
  });

  test('when .setAttributeName(foo) and mandatory option then missing throws', () => {
    const program = createTestCommand();
    program.addOption(
      new Option('--baud <rate>')
        .setAttributeName('baudRate')
        .makeOptionMandatory(),
    );
    assert.throws(
      () => {
        program.parse([], { from: 'user' });
      },
      { code: 'commander.missingMandatoryOptionValue' },
    );
  });

  test('when .setAttributeName(foo) and .env(bar) then env stores value with custom attribute name', () => {
    const program = new Command();
    const envName = 'COMMANDER_USE_MCP_SERVER';
    program.addOption(
      new Option('--use-mcp-server <value>')
        .setAttributeName('useMCPServer')
        .env(envName),
    );
    process.env[envName] = 'VALUE';
    program.parse([], { from: 'user' });
    assert.equal(program.opts().useMCPServer, 'VALUE');
    delete process.env[envName];
  });
});
