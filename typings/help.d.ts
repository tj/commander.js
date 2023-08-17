/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 */
export type Argument = import("./argument.js").Argument;
/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 */
export type Command = import("./command.js").Command;
/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 */
export type Option = import("./option.js").Option;
/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 * @typedef { import("./argument.js").Argument } Argument
 * @typedef { import("./command.js").Command } Command
 * @typedef { import("./option.js").Option } Option
 */
export class Help {
    helpWidth: any;
    sortSubcommands: boolean;
    sortOptions: boolean;
    showGlobalOptions: boolean;
    /**
     * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
     *
     * @param {Command} cmd
     * @returns {Command[]}
     */
    visibleCommands(cmd: Command): Command[];
    /**
     * Compare options for sort.
     *
     * @param {Option} a
     * @param {Option} b
     * @returns number
     */
    compareOptions(a: Option, b: Option): any;
    /**
     * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
     *
     * @param {Command} cmd
     * @returns {Option[]}
     */
    visibleOptions(cmd: Command): Option[];
    /**
     * Get an array of the visible global options. (Not including help.)
     *
     * @param {Command} cmd
     * @returns {Option[]}
     */
    visibleGlobalOptions(cmd: Command): Option[];
    /**
     * Get an array of the arguments if any have a description.
     *
     * @param {Command} cmd
     * @returns {Argument[]}
     */
    visibleArguments(cmd: Command): Argument[];
    /**
     * Get the command term to show in the list of subcommands.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    subcommandTerm(cmd: Command): string;
    /**
     * Get the option term to show in the list of options.
     *
     * @param {Option} option
     * @returns {string}
     */
    optionTerm(option: Option): string;
    /**
     * Get the argument term to show in the list of arguments.
     *
     * @param {Argument} argument
     * @returns {string}
     */
    argumentTerm(argument: Argument): string;
    /**
     * Get the longest command term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestSubcommandTermLength(cmd: Command, helper: Help): number;
    /**
     * Get the longest option term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestOptionTermLength(cmd: Command, helper: Help): number;
    /**
     * Get the longest global option term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestGlobalOptionTermLength(cmd: Command, helper: Help): number;
    /**
     * Get the longest argument term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    longestArgumentTermLength(cmd: Command, helper: Help): number;
    /**
     * Get the command usage to be displayed at the top of the built-in help.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    commandUsage(cmd: Command): string;
    /**
     * Get the description for the command.
     *
     * @param {Command} cmd
     * @returns {string}
     */
    commandDescription(cmd: Command): string;
    /**
     * Get the subcommand summary to show in the list of subcommands.
     * (Fallback to description for backwards compatibility.)
     *
     * @param {Command} cmd
     * @returns {string}
     */
    subcommandDescription(cmd: Command): string;
    /**
     * Get the option description to show in the list of options.
     *
     * @param {Option} option
     * @return {string}
     */
    optionDescription(option: Option): string;
    /**
     * Get the argument description to show in the list of arguments.
     *
     * @param {Argument} argument
     * @return {string}
     */
    argumentDescription(argument: Argument): string;
    /**
     * Generate the built-in help text.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {string}
     */
    formatHelp(cmd: Command, helper: Help): string;
    /**
     * Calculate the pad width from the maximum term length.
     *
     * @param {Command} cmd
     * @param {Help} helper
     * @returns {number}
     */
    padWidth(cmd: Command, helper: Help): number;
    /**
     * Wrap the given string to width characters per line, with lines after the first indented.
     * Do not wrap if insufficient room for wrapping (minColumnWidth), or string is manually formatted.
     *
     * @param {string} str
     * @param {number} width
     * @param {number} indent
     * @param {number} [minColumnWidth=40]
     * @return {string}
     *
     */
    wrap(str: string, width: number, indent: number, minColumnWidth?: number | undefined): string;
}
//# sourceMappingURL=help.d.ts.map