import * as commander from '../index.js';
import { test } from 'node:test';
import assert from 'node:assert/strict';

test('when call nested subcommand then runs', (t) => {
  const program = new commander.Command();
  const leafAction = t.mock.fn();
  program.command('sub1').command('sub2').action(leafAction);
  program.parse('node test.js sub1 sub2'.split(' '));
  assert.equal(leafAction.mock.callCount(), 1);
});
