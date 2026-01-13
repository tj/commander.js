const commander = require('../');
const { test, describe } = require('node:test');
const assert = require('node:assert/strict');

// Capitalise the letters of words after dashes, but otherwise preserve case

describe('option property is camelCase of option name', () => {
  test('when option defined with --word-word then option property is wordWord', () => {
    const program = new commander.Command();
    program.option('--my-option', 'description');
    program.parse(['node', 'test', '--my-option']);
    assert.equal(program.opts().myOption, true);
  });

  test('when option defined with --word-wORD then option property is wordWORD', () => {
    const program = new commander.Command();
    program.option('--my-oPTION', 'description');
    program.parse(['node', 'test', '--my-oPTION']);
    assert.equal(program.opts().myOPTION, true);
  });

  test('when option defined with --word-WORD then option property is wordWORD', () => {
    const program = new commander.Command();
    program.option('--my-OPTION', 'description');
    program.parse(['node', 'test', '--my-OPTION']);
    assert.equal(program.opts().myOPTION, true);
  });

  test('when option defined with --word-word-word then option property is wordWordWord', () => {
    const program = new commander.Command();
    program.option('--my-special-option', 'description');
    program.parse(['node', 'test', '--my-special-option']);
    assert.equal(program.opts().mySpecialOption, true);
  });

  test('when option defined with --word-WORD-word then option property is wordWORDWord', () => {
    const program = new commander.Command();
    program.option('--my-SPECIAL-option', 'description');
    program.parse(['node', 'test', '--my-SPECIAL-option']);
    assert.equal(program.opts().mySPECIALOption, true);
  });

  test('when option defined with --Word then option property is Word', () => {
    const program = new commander.Command();
    program.option('--Myoption', 'description');
    program.parse(['node', 'test', '--Myoption']);
    assert.equal(program.opts().Myoption, true);
  });
});
