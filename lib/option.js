/**
 * Initialize a new `Option` with the given `flags` and `description`.
 *
 * @param {String} flags
 * @param {String} description
 * @api public
 */

class Option {
  constructor(flags, description) {
    this.flags = flags;
    this.required = flags.indexOf('<') >= 0; // A value must be supplied when the option is specified.
    this.optional = flags.indexOf('[') >= 0; // A value is optional when the option is specified.
    this.mandatory = false; // The option must have a value after parsing, which usually means it must be specified on command line.
    this.negate = flags.indexOf('-no-') !== -1;
    flags = flags.split(/[ ,|]+/);
    if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
    this.long = flags.shift();
    this.description = description || '';
  }

  /**
   * Return option name.
   *
   * @return {String}
   * @api private
   */
  name() {
    return this.long.replace(/^--/, '');
  }

  /**
   * Return option name, in a camelcase format that can be used
   * as a object attribute key.
   *
   * @return {String}
   * @api private
   */

  attributeName() {
    return camelCase(this.name().replace(/^no-/, ''));
  }

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {String} arg
   * @return {Boolean}
   * @api private
   */

  is(arg) {
    return this.short === arg || this.long === arg;
  };
}

/**
 * Camel-case the given `flag`
 *
 * @param {String} flag
 * @return {String}
 * @api private
 */

function camelCase(flag) {
  return flag.split('-').reduce((str, word) => str + word[0].toUpperCase() + word.slice(1));
}

module.exports = { Option };
