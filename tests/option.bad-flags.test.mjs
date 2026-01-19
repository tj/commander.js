import { Option } from '../index.js';
import { test, describe } from 'node:test';
import assert from 'node:assert/strict';

// Check that unsupported flags throw.
describe('when construct Option with unsupported flags then throw', () => {
  const flagsList = [
    { flags: '-a, -b' }, // too many short flags
    { flags: '-a, -b <value>' },
    { flags: '-a, -b, --long' },
    { flags: '--one, --two, --three' }, // too many long flags
    { flags: '-ws' }, // short flag with more than one character
    { flags: '---triple' }, // double dash not followed by a non-dash
    { flags: 'sdkjhskjh' }, // oops, no flags
    { flags: '-a,-b' }, // try all the separators
    { flags: '-a|-b' },
    { flags: '-a -b' },
  ];
  for (const { flags } of flagsList) {
    test(`when construct Option with flags ${flags} then throw`, () => {
      assert.throws(
        () => {
          new Option(flags);
        },
        { message: /^option creation failed/ },
      );
    });
  }
});

// Check that supported flags do not throw.
describe('when construct Option with supported flags then do not throw', () => {
  const flagsList = [
    { flags: '-s' }, // single short
    { flags: '--long' }, // single long
    { flags: '-b, --both' }, // short and long
    { flags: '--both, -b' }, // long and short
    { flags: '--ws, --workspace' }, // two long (morally shortish and long)
    { flags: '-b,--both <comma>' },
    { flags: '-b|--both <bar>' },
    { flags: '-b --both [space]' },
    { flags: '-v, --variadic <files...>' },
  ];
  for (const { flags } of flagsList) {
    test(`when construct Option with flags ${flags} then do not throw`, () => {
      assert.doesNotThrow(() => {
        new Option(flags);
      });
    });
  }
});
