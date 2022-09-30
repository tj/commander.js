// ts-check

class I18n {
  constructor() {
    this._locale = undefined;
    this._translations = undefined;
    this.t = this.translate.bind(this);
    // Lazy create list formatters when needed.
    this._listFormats = {}; // key is list type
  }

  /**
   *
   * @param {TemplateStringsArray} strings
   * @param  {...any} args
   * @returns string
   * @api private
   */
  translate(strings, ...args) {
    if (!this._translations) return I18n.interpolate(strings, ...args);

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
    this._listFormats = {}; // reset cache
    // ToDo: load translations from file?
    this._translations = {};
  }

  /**
   * @param {Object.<string, string>} dictionary
   */
  updateStrings(dictionary) {
    this._translations = Object.assign(this._translations || {}, dictionary);
  }

  /**
   *
   * @param {string} type - 'conjunction' or 'disjunction' or 'unit' (Intl.ListFormatType)
   * @returns function
   */
  _createListFormat(type) {
    try {
      // @ts-ignore Intl.ListFormat not known
      if (this._locale !== undefined && Intl.ListFormat.supportedLocalesOf(this._locale).length > 0) {
        // @ts-ignore Intl.ListFormat not known
        return new Intl.ListFormat(this._locale, { style: 'narrow', type });
      }
    } catch (e) {
    }

    return null;
  }

  /**
   * @param {string[]} items
   * @param {string} [listType] - 'conjunction' or 'disjunction' or 'unit', default 'conjunction'
   * @returns string
   */
  formatList(items, listType = 'conjunction') {
    if (this._listFormats[listType] === undefined) {
      this._listFormats[listType] = this._createListFormat(listType);
    }
    if (this._listFormats[listType]) {
      return this._listFormats[listType].format(items);
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
