import * as commander from '../index.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('when when multiple short flags specified then parsed as short option group', () => {
  const program = new commander.Command();
  program
    .option('-p, --pepper', 'add pepper')
    .option('-c, --cheese', 'add cheese');

  program.parse(['node', 'test', '-pc']);

  assert.equal(program.opts().pepper, true);
  assert.equal(program.opts().cheese, true);
});
