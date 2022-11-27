// This is testing what is currently a private class.

const { I18n } = require('../lib/i18n.js');

// Currently testing back to node 12 on master branch, and node 12 does not have full ICU.
const nodeMajor = parseInt(process.versions.node.split('.')[0]);
const describeOrSkipOnNode12 = (nodeMajor <= 12) ? describe.skip : describe;

describe('using t for tagged template literals', () => {
  test('when use t from unconfigured object then returns interpolated string', () => {
    const i18n = new I18n();
    const value = 'middle';
    expect(i18n.t`before ${value} after`).toEqual(`before ${value} after`);
  });

  test('when copy t from unconfigured object then returns interpolated string', () => {
    const translate = new I18n().t;
    const value = 'middle';
    expect(translate`before ${value} after`).toEqual(`before ${value} after`);
  });

  test('when configureStrings and unknown key then returns interpolated string', () => {
    const i18n = new I18n();
    i18n.updateStrings({ '{0}': '{0}' });
    const value = 'middle';
    expect(i18n.t`before ${value} after`).toEqual(`before ${value} after`);
  });

  test('when configureStrings and known key then returns translated string', () => {
    const i18n = new I18n();
    i18n.updateStrings({ 'known {0}': 'KNOWN {0}' });
    const value = 'VALUE';
    expect(i18n.t`known ${value}`).toEqual('KNOWN VALUE');
  });

  test('when translation uses arg more than once then returns translated string', () => {
    const i18n = new I18n();
    i18n.updateStrings({ 'repeat {0}': '{0} {0}' });
    const value = 'VALUE';
    expect(i18n.t`repeat ${value}`).toEqual('VALUE VALUE');
  });

  test('when translation changes arg order then returns translated string', () => {
    const i18n = new I18n();
    i18n.updateStrings({ 'switch {0} {1}': '{1} {0}' });
    expect(i18n.t`switch ${'a'} ${'b'}`).toEqual('b a');
  });
});

describe('formatList', () => {
  test('when use unconfigured object then returns comma separated string', () => {
    const i18n = new I18n();
    const list = ['a', 'b', 'c'];
    expect(i18n.formatList(list)).toEqual(list.join(', '));
  });

  test('when set localeName to unrecognised locale then returns comma separated string', () => {
    const i18n = new I18n();
    i18n.localeName('this_is_not_a_locale');
    const list = ['a', 'b', 'c'];
    expect(i18n.formatList(list)).toEqual(list.join(', '));
  });

  test('when set localeName to en then returns 1, 2', () => {
    const i18n = new I18n();
    i18n.localeName('en');
    const list = ['1', '2'];
    expect(i18n.formatList(list)).toEqual('1, 2');
  });

  test('when set localeName to en and disjunction then returns 1 or 2', () => {
    const i18n = new I18n();
    i18n.localeName('en');
    const list = ['1', '2'];
    expect(i18n.formatList(list, 'disjunction')).toEqual('1 or 2');
  });
});

describeOrSkipOnNode12('formatList with es locale (skipped in node 12)', () => {
  test('when set localeName to es then returns 1 y 2', () => {
    const i18n = new I18n();
    i18n.localeName('es');
    const list = ['1', '2'];
    expect(i18n.formatList(list)).toEqual('1 y 2');
  });

  test('when set localeName to es and conjunction then returns 1 y 2', () => {
    const i18n = new I18n();
    i18n.localeName('es');
    const list = ['1', '2'];
    expect(i18n.formatList(list, 'conjunction')).toEqual('1 y 2');
  });

  test('when set localeName to es and disjunction then returns 1 o 2', () => {
    const i18n = new I18n();
    i18n.localeName('es');
    const list = ['1', '2'];
    expect(i18n.formatList(list, 'disjunction')).toEqual('1 o 2');
  });
});

describe('loadLocale', () => {
  test('when valid locale and translated then does not throw', () => {
    const i18n = new I18n();
    expect(() => {
      i18n.loadLocale('en');
    }).not.toThrow();
  });

  test('when invalid locale then throws', () => {
    const i18n = new I18n();
    expect(() => {
      i18n.loadLocale('x');
    }).toThrow("Commander: unrecognised locale 'x'");
  });

  test('when valid locale but not translated then throws', () => {
    const i18n = new I18n();
    expect(() => {
      // Change target if add a translation for isiZulu.
      i18n.loadLocale('zu');
    }).toThrow("Commander: translations not found for locale 'zu'");
  });

  // Add more tests when have a detectable locale
});

describe('accumulate strings', () => {
  test('when updateStrings twice then accumulates', () => {
    const i18n = new I18n();
    i18n.updateStrings({ first: 'FIRST' });
    i18n.updateStrings({ second: 'SECOND' });
    expect(i18n.t`first`).toEqual('FIRST');
    expect(i18n.t`second`).toEqual('SECOND');
  });

  test('when updateStrings twice then overwrites duplicates', () => {
    const i18n = new I18n();
    i18n.updateStrings({ same: 'FIRST' });
    i18n.updateStrings({ same: 'SECOND' });
    expect(i18n.t`same`).toEqual('SECOND');
  });

  test('when updateStrings then locale then accumulates', () => {
    const i18n = new I18n();
    i18n.updateStrings({ first: 'FIRST' });
    i18n.loadLocale('en'); // Change to detectable locale when have one
    expect(i18n.t`first`).toEqual('FIRST');
  });

  // Add more localLocale tests when have one that does some translation!
  // 'when loadLocale then updateStrings then accumulates'
  // 'when loadLocale then loadLocale then accumulates'
});

test('when set localeName and get localeName then returns localeName', () => {
  const i18n = new I18n();
  const exampleName = 'my-locale';
  i18n.localeName(exampleName);
  expect(i18n.localeName()).toEqual(exampleName);
});
