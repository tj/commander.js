export class Option {
    /**
     * Initialize a new `Option` with the given `flags` and `description`.
     *
     * @param {string} flags
     * @param {string} [description]
     */
    constructor(flags: string, description?: string | undefined);
    flags: string;
    description: string;
    required: boolean;
    optional: boolean;
    variadic: boolean;
    mandatory: boolean;
    short: any;
    long: any;
    negate: any;
    defaultValue: any;
    defaultValueDescription: string | undefined;
    presetArg: any;
    envVar: string | undefined;
    parseArg: Function | ((arg: any, previous: any) => any) | undefined;
    hidden: boolean;
    argChoices: string[] | undefined;
    conflictsWith: any[];
    implied: any;
    /**
     * Set the default value, and optionally supply the description to be displayed in the help.
     *
     * @param {any} value
     * @param {string} [description]
     * @return {Option}
     */
    default(value: any, description?: string | undefined): Option;
    /**
     * Preset to use when option used without option-argument, especially optional but also boolean and negated.
     * The custom processing (parseArg) is called.
     *
     * @example
     * new Option('--color').default('GREYSCALE').preset('RGB');
     * new Option('--donate [amount]').preset('20').argParser(parseFloat);
     *
     * @param {any} arg
     * @return {Option}
     */
    preset(arg: any): Option;
    /**
     * Add option name(s) that conflict with this option.
     * An error will be displayed if conflicting options are found during parsing.
     *
     * @example
     * new Option('--rgb').conflicts('cmyk');
     * new Option('--js').conflicts(['ts', 'jsx']);
     *
     * @param {string | string[]} names
     * @return {Option}
     */
    conflicts(names: string | string[]): Option;
    /**
     * Specify implied option values for when this option is set and the implied options are not.
     *
     * The custom processing (parseArg) is not called on the implied values.
     *
     * @example
     * program
     *   .addOption(new Option('--log', 'write logging information to file'))
     *   .addOption(new Option('--trace', 'log extra details').implies({ log: 'trace.txt' }));
     *
     * @param {Object} impliedOptionValues
     * @return {Option}
     */
    implies(impliedOptionValues: any): Option;
    /**
     * Set environment variable to check for option value.
     *
     * An environment variable is only used if when processed the current option value is
     * undefined, or the source of the current value is 'default' or 'config' or 'env'.
     *
     * @param {string} name
     * @return {Option}
     */
    env(name: string): Option;
    /**
     * Set the custom handler for processing CLI option arguments into option values.
     *
     * @param {Function} [fn]
     * @return {Option}
     */
    argParser(fn?: Function | undefined): Option;
    /**
     * Whether the option is mandatory and must have a value after parsing.
     *
     * @param {boolean} [mandatory=true]
     * @return {Option}
     */
    makeOptionMandatory(mandatory?: boolean | undefined): Option;
    /**
     * Hide option in help.
     *
     * @param {boolean} [hide=true]
     * @return {Option}
     */
    hideHelp(hide?: boolean | undefined): Option;
    /**
     * @package
     */
    _concatValue(value: any, previous: any): any[];
    /**
     * Only allow option value to be one of choices.
     *
     * @param {string[]} values
     * @return {Option}
     */
    choices(values: string[]): Option;
    /**
     * Return option name.
     *
     * @return {string}
     */
    name(): string;
    /**
     * Return option name, in a camelcase format that can be used
     * as a object attribute key.
     *
     * @return {string}
     * @package
     */
    attributeName(): string;
    /**
     * Check if `arg` matches the short or long flag.
     *
     * @param {string} arg
     * @return {boolean}
     * @package
     */
    is(arg: string): boolean;
    /**
     * Return whether a boolean option.
     *
     * Options are one of boolean, negated, required argument, or optional argument.
     *
     * @return {boolean}
     * @package
     */
    isBoolean(): boolean;
}
/**
 * Split the short and long flag out of something like '-m,--mixed <value>'
 *
 * @package
 */
export function splitOptionFlags(flags: any): {
    shortFlag: any;
    longFlag: any;
};
/**
 * This class is to make it easier to work with dual options, without changing the existing
 * implementation. We support separate dual options for separate positive and negative options,
 * like `--build` and `--no-build`, which share a single option value. This works nicely for some
 * use cases, but is tricky for others where we want separate behaviours despite
 * the single shared option value.
 */
export class DualOptions {
    /**
     * @param {Option[]} options
     */
    constructor(options: Option[]);
    positiveOptions: Map<any, any>;
    negativeOptions: Map<any, any>;
    dualOptions: Set<any>;
    /**
     * Did the value come from the option, and not from possible matching dual option?
     *
     * @param {any} value
     * @param {Option} option
     * @returns {boolean}
     */
    valueFromOption(value: any, option: Option): boolean;
}
//# sourceMappingURL=option.d.ts.map