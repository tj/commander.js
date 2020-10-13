const commander = require('../');
const stream = require('stream');

test('when command output stream is not set then default is process.stdout', () => {
  const program = new commander.Command();
  expect(program.outputStream()).toBe(process.stdout);
});

test('when set command output stream then command output stream is set', () => {
  const program = new commander.Command();
  const customStream = new stream.Writable();
  program.outputStream(customStream);
  expect(program.outputStream()).toBe(customStream);
});
