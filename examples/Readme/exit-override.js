program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  // custom processing...
}
