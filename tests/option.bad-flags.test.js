const { Option } = require('../');

// Check that unsupported flags throw.
test.each([
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
])('when construct Option with flags %p then throw', ({ flags }) => {
  expect(() => {
    new Option(flags);
  }).toThrow(/^option creation failed/);
});

// Check that supported flags do not throw.
test.each([
  { flags: '-s' }, // single short
  { flags: '--long' }, // single long
  { flags: '-b, --both' }, // short and long
  { flags: '--both, -b' }, // long and short
  { flags: '--ws, --workspace' }, // two long (morally shortish and long)
  { flags: '-b,--both <comma>' },
  { flags: '-b|--both <bar>' },
  { flags: '-b --both [space]' },
  { flags: '-v, --variadic <files...>' },
])('when construct Option with flags %p then do not throw', ({ flags }) => {
  expect(() => {
    new Option(flags);
  }).not.toThrow();
});
