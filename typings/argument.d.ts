export class Argument {
    /**
     * Initialize a new command argument with the given name and description.
     * The default is that the argument is required, and you can explicitly
     * indicate this with <> around the name. Put [] around the name for an optional argument.
     *
     * @param {string} name
     * @param {string} [description]
     */
    constructor(name: string, description?: string | undefined);
    description: string;
    variadic: boolean;
    parseArg: Function | ((arg: any, previous: any) => any) | undefined;
    defaultValue: any;
    defaultValueDescription: string | undefined;
    argChoices: string[] | undefined;
    required: boolean;
    _name: string;
    /**
     * Return argument name.
     *
     * @return {string}
     */
    name(): string;
    /**
     * @package
     */
    _concatValue(value: any, previous: any): any[];
    /**
     * Set the default value, and optionally supply the description to be displayed in the help.
     *
     * @param {any} value
     * @param {string} [description]
     * @return {Argument}
     */
    default(value: any, description?: string | undefined): Argument;
    /**
     * Set the custom handler for processing CLI command arguments into argument values.
     *
     * @param {Function} [fn]
     * @return {Argument}
     */
    argParser(fn?: Function | undefined): Argument;
    /**
     * Only allow argument value to be one of choices.
     *
     * @param {string[]} values
     * @return {Argument}
     */
    choices(values: string[]): Argument;
    /**
     * Make argument required.
     */
    argRequired(): Argument;
    /**
     * Make argument optional.
     */
    argOptional(): Argument;
}
/**
 * Takes an argument and returns its human readable equivalent for help usage.
 *
 * @param {Argument} arg
 * @return {string}
 * @package
 */
export function humanReadableArgName(arg: Argument): string;
//# sourceMappingURL=argument.d.ts.map