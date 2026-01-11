const { Command } = require('../');
const { test } = require('node:test');
const assert = require('node:assert/strict');

function getSuggestion(program, arg) {
  let message = '';
  program.exitOverride().configureOutput({
    writeErr: (str) => {
      message = str;
    },
  });

  try {
    program.parse([arg], { from: 'user' });
  } catch (err) {
    /* empty */
  }

  const match = message.match(/Did you mean (one of )?(.*)\?/);
  return match ? match[2] : null;
}

test('when unknown command and showSuggestionAfterError() then show suggestion', () => {
  const program = new Command();
  program.showSuggestionAfterError();
  program.command('example');
  const suggestion = getSuggestion(program, 'exampel');
  assert.equal(suggestion, 'example');
});

test('when unknown command and showSuggestionAfterError(false) then do not show suggestion', () => {
  const program = new Command();
  program.showSuggestionAfterError(false);
  program.command('example');
  const suggestion = getSuggestion(program, 'exampel');
  assert.equal(suggestion, null);
});

test('when unknown option and showSuggestionAfterError() then show suggestion', () => {
  const program = new Command();
  program.showSuggestionAfterError();
  program.option('--example');
  const suggestion = getSuggestion(program, '--exampel');
  assert.equal(suggestion, '--example');
});

test('when unknown option and showSuggestionAfterError(false) then do not show suggestion', () => {
  const program = new Command();
  program.showSuggestionAfterError(false);
  program.option('--example');
  const suggestion = getSuggestion(program, '--exampel');
  assert.equal(suggestion, null);
});
