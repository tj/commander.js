// ts-check

class I18n {
  constructor() {
    this._locale = undefined;
    this._translations = {};
    this.t = I18n.interpolate; // No strings to translate yet.
    // Lazy create list formatters when needed.
    this._listFormatConjunction = undefined;
    this._listFormatDisjunction = undefined;
  }

  /**
   *
   * @param {TemplateStringsArray} strings
   * @param  {...any} args
   * @returns string
   * @api private
   */
  translate(strings, ...args) {
    // Make a key by putting in placeholders for the args, like {0}.
    const key = strings.reduce((accumulator, str, index) => {
      return accumulator + `{${index - 1}}` + str;
    });

    // Look up possible replacement.
    let template = this._translations[key];
    if (template === undefined) template = key;

    // Fill in the placeholders with the actual args.
    return template.replace(/{(\d+)}/g, (match, digits) => {
      return `${args[digits]}`; // paranoia: convert arg to string
    });
  }

  /**
   * @param {string} locale
   */
  locale(locale) {
    this._locale = locale;
    // Load strings from locale or throw...
    this.t = this.translate.bind(this);
  }

  /**
   * @param {Object.<string, string>} dictionary
   */
  updateStrings(dictionary) {
    this._translations = Object.assign(this._translations, dictionary);
    this.t = this.translate.bind(this);
  }

  /**
   *
   * @param {Object} options
   * @returns function
   */
  _createListFormatter(options) {
    // @ts-ig nore Intl. ListFormat is not defined
    if (this._locale !== undefined && Intl.ListFormat.supportedLocalesOf(this._locale).length > 0) {
      // @ts-ignore Intl.ListFormat is not defined
      return new Intl.ListFormat(this._locale, options);
    }
    return null;
  }

  /**
   * @param {string[]} items
   * @returns string
   */
  listFormatConjunction(items) {
    if (this._listFormatConjunction === undefined) {
      this._listFormatConjunction = this._createListFormatter({ style: 'narrow', type: 'conjunction' });
    }
    if (this._listFormatConjunction) {
      return this._listFormatConjunction.format(items);
    }
    return items.join(', ');
  }

  /**
   * @param {string[]} items
   * @returns string
   */
  listFormatDisjunction(items) {
    if (this._listFormatConjunction === undefined) {
      this._listFormatDisjunction = this._createListFormatter({ style: 'narrow', type: 'disjunction' });
    }
    if (this._listFormatDisjunction) {
      return this._listFormatDisjunction.format(items);
    }
    return items.join(', ');
  }

  /**
   * Function for tagged literal template with no translation.
   * Used when locale not specified.
   *
   * @returns string
   */
  static interpolate(strings, ...args) {
    return strings.reduce((accumulator, str, index) => {
      return accumulator + args[index - 1] + str;
    });
  }
}

exports.I18n = I18n;
