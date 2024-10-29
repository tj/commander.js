const { Option } = require('../');

// Check that unsupported flags throw.
test.each([
  { flags: '-a, -b' }, // too many short flags
  { flags: '-a, -b <value>' },
  { flags: '-a, -b, --long' },
  { flags: '--one, --two' }, // too many long flags
  { flags: '--one, --two [value]' },
  { flags: '-ws' }, // short flag with more than one character
  { flags: 'sdkjhskjh' }, // oops, no flags
  { flags: '-a,-b' }, // try all the separators
  { flags: '-a|-b' },
  { flags: '-a -b' },
])('when construct Option with flags %p then throw', ({ flags }) => {
  expect(() => {
    new Option(flags);
  }).toThrow(/^invalid Option flags/);
});

// Check that supported flags do not throw.
test.each([
  { flags: '-s' }, // single short
  { flags: '--long' }, // single long
  { flags: '-b, --both' }, // short and long
  { flags: '-b,--both <comma>' },
  { flags: '-b|--both <bar>' },
  { flags: '-b --both [space]' },
  { flags: '-v, --variadic <files...>' },
])('when construct Option with flags %p then do not throw', ({ flags }) => {
  expect(() => {
    new Option(flags);
  }).not.toThrow();
});
