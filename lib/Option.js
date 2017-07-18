/**
 * Option.
 */
class Option {
  /**
   * @param {string} flags
   * @param {string} description
   */
  constructor(flags, description) {
    this.flags = flags;
    this.required = ~flags.indexOf('<');
    this.optional = ~flags.indexOf('[');
    this.bool = !~flags.indexOf('-no-');
    flags = flags.split(/[ ,|]+/);
    if (flags.length > 1 && !/^[[<]/.test(flags[1])) this.short = flags.shift();
    this.long = flags.shift();
    this.description = description || '';
  }

  /**
   * Return option name.
   *
   * @return {string}
   */
  name() {
    return this.long
      .replace('--', '')
      .replace('no-', '');
  }

  /**
   * Check if `arg` matches the short or long flag.
   *
   * @param {string} arg
   * @return {boolean}
   */
  is(arg) {
    return arg == this.short || arg == this.long;
  }
}


module.exports = Option;
