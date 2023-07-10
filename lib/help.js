const { humanReadableArgName } = require('./argument.js');
const { CommanderError } = require('./error.js');

/**
 * TypeScript import types for JSDoc, used by Visual Studio Code IntelliSense and `npm run typescript-checkJS`
 * https://www.typescriptlang.org/docs/handbook/jsdoc-supported-types.html#import-types
 * @typedef { import("./argument.js").Argument } Argument
 * @typedef { import("./command.js").Command } Command
 * @typedef { import("./option.js").Option } Option
 */

// @ts-check

// Although this is a class, methods are static in style to allow override using subclass or just functions.
class Help {
  constructor() {
    this.helpWidth = undefined;
    this.sortSubcommands = false;
    this.sortOptions = false;
    this.showGlobalOptions = false;
  }

  /**
   * Get an array of the visible subcommands. Includes a placeholder for the implicit help command, if there is one.
   *
   * @param {Command} cmd
   * @returns {Command[]}
   */

  visibleCommands(cmd) {
    const visibleCommands = cmd.commands.filter(cmd => !cmd._hidden);
    if (cmd._hasImplicitHelpCommand()) {
      // Create a command matching the implicit help command.
      const [, helpName, helpArgs] = cmd._helpCommandnameAndArgs.match(/([^ ]+) *(.*)/);
      const helpCommand = cmd.createCommand(helpName)
        .helpOption(false);
      helpCommand.description(cmd._helpCommandDescription);
      if (helpArgs) helpCommand.arguments(helpArgs);
      visibleCommands.push(helpCommand);
    }
    if (this.sortSubcommands) {
      visibleCommands.sort((a, b) => {
        // @ts-ignore: overloaded return type
        return a.name().localeCompare(b.name());
      });
    }
    return visibleCommands;
  }

  /**
   * Compare options for sort.
   *
   * @param {Option} a
   * @param {Option} b
   * @returns number
   */
  compareOptions(a, b) {
    const getSortKey = (option) => {
      // WYSIWYG for order displayed in help. Short used for comparison if present. No special handling for negated.
      return option.short ? option.short.replace(/^-/, '') : option.long.replace(/^--/, '');
    };
    return getSortKey(a).localeCompare(getSortKey(b));
  }

  /**
   * Get an array of the visible options. Includes a placeholder for the implicit help option, if there is one.
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleOptions(cmd) {
    const visibleOptions = cmd.options.filter((option) => !option.hidden);
    // Implicit help
    const showShortHelpFlag = cmd._hasHelpOption && cmd._helpShortFlag && !cmd._findOption(cmd._helpShortFlag);
    const showLongHelpFlag = cmd._hasHelpOption && !cmd._findOption(cmd._helpLongFlag);
    if (showShortHelpFlag || showLongHelpFlag) {
      let helpOption;
      if (!showShortHelpFlag) {
        helpOption = cmd.createOption(cmd._helpLongFlag, cmd._helpDescription);
      } else if (!showLongHelpFlag) {
        helpOption = cmd.createOption(cmd._helpShortFlag, cmd._helpDescription);
      } else {
        helpOption = cmd.createOption(cmd._helpFlags, cmd._helpDescription);
      }
      visibleOptions.push(helpOption);
    }
    if (this.sortOptions) {
      visibleOptions.sort(this.compareOptions);
    }
    return visibleOptions;
  }

  /**
   * Get an array of the visible global options. (Not including help.)
   *
   * @param {Command} cmd
   * @returns {Option[]}
   */

  visibleGlobalOptions(cmd) {
    if (!this.showGlobalOptions) return [];

    const globalOptions = [];
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      const visibleOptions = parentCmd.options.filter((option) => !option.hidden);
      globalOptions.push(...visibleOptions);
    }
    if (this.sortOptions) {
      globalOptions.sort(this.compareOptions);
    }
    return globalOptions;
  }

  /**
   * Get an array of the arguments if any have a description.
   *
   * @param {Command} cmd
   * @returns {Argument[]}
   */

  visibleArguments(cmd) {
    // Side effect! Apply the legacy descriptions before the arguments are displayed.
    if (cmd._argsDescription) {
      cmd._args.forEach(argument => {
        argument.description = argument.description || cmd._argsDescription[argument.name()] || '';
      });
    }

    // If there are any arguments with a description then return all the arguments.
    if (cmd._args.find(argument => argument.description)) {
      return cmd._args;
    }
    return [];
  }

  /**
   * Get the command term to show in the list of subcommands.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandTerm(cmd) {
    // Legacy. Ignores custom usage string, and nested commands.
    const args = cmd._args.map(arg => humanReadableArgName(arg)).join(' ');
    return cmd._name +
      (cmd._aliases[0] ? '|' + cmd._aliases[0] : '') +
      (cmd.options.length ? ' [options]' : '') + // simplistic check for non-help option
      (args ? ' ' + args : '');
  }

  /**
   * Get the option term to show in the list of options.
   *
   * @param {Option} option
   * @returns {string}
   */

  optionTerm(option) {
    return option.flags;
  }

  /**
   * Get the argument term to show in the list of arguments.
   *
   * @param {Argument} argument
   * @returns {string}
   */

  argumentTerm(argument) {
    return argument.name();
  }

  /**
   * Get the longest command term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestSubcommandTermLength(cmd, helper) {
    return helper.visibleCommands(cmd).reduce((max, command) => {
      return Math.max(max, helper.subcommandTerm(command).length);
    }, 0);
  }

  /**
   * Get the longest option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestOptionTermLength(cmd, helper) {
    return helper.visibleOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  }

  /**
   * Get the longest global option term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestGlobalOptionTermLength(cmd, helper) {
    return helper.visibleGlobalOptions(cmd).reduce((max, option) => {
      return Math.max(max, helper.optionTerm(option).length);
    }, 0);
  }

  /**
   * Get the longest argument term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  longestArgumentTermLength(cmd, helper) {
    return helper.visibleArguments(cmd).reduce((max, argument) => {
      return Math.max(max, helper.argumentTerm(argument).length);
    }, 0);
  }

  /**
   * Get the command usage to be displayed at the top of the built-in help.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandUsage(cmd) {
    // Usage
    let cmdName = cmd._name;
    if (cmd._aliases[0]) {
      cmdName = cmdName + '|' + cmd._aliases[0];
    }
    let parentCmdNames = '';
    for (let parentCmd = cmd.parent; parentCmd; parentCmd = parentCmd.parent) {
      parentCmdNames = parentCmd.name() + ' ' + parentCmdNames;
    }
    return parentCmdNames + cmdName + ' ' + cmd.usage();
  }

  /**
   * Get the description for the command.
   *
   * @param {Command} cmd
   * @returns {string}
   */

  commandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.description();
  }

  /**
   * Get the subcommand summary to show in the list of subcommands.
   * (Fallback to description for backwards compatibility.)
   *
   * @param {Command} cmd
   * @returns {string}
   */

  subcommandDescription(cmd) {
    // @ts-ignore: overloaded return type
    return cmd.summary() || cmd.description();
  }

  /**
   * Get the option description to show in the list of options.
   *
   * @param {Option} option
   * @return {string}
   */

  optionDescription(option) {
    const extraInfo = [];

    if (option.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${option.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (option.defaultValue !== undefined) {
      // default for boolean and negated more for programmer than end user,
      // but show true/false for boolean option as may be for hand-rolled env or config processing.
      const showDefault = option.required || option.optional ||
        (option.isBoolean() && typeof option.defaultValue === 'boolean');
      if (showDefault) {
        extraInfo.push(`default: ${option.defaultValueDescription || JSON.stringify(option.defaultValue)}`);
      }
    }
    // preset for boolean and negated are more for programmer than end user
    if (option.presetArg !== undefined && option.optional) {
      extraInfo.push(`preset: ${JSON.stringify(option.presetArg)}`);
    }
    if (option.envVar !== undefined) {
      extraInfo.push(`env: ${option.envVar}`);
    }
    if (extraInfo.length > 0) {
      return `${option.description} (${extraInfo.join(', ')})`;
    }

    return option.description;
  }

  /**
   * Get the argument description to show in the list of arguments.
   *
   * @param {Argument} argument
   * @return {string}
   */

  argumentDescription(argument) {
    const extraInfo = [];
    if (argument.argChoices) {
      extraInfo.push(
        // use stringify to match the display of the default value
        `choices: ${argument.argChoices.map((choice) => JSON.stringify(choice)).join(', ')}`);
    }
    if (argument.defaultValue !== undefined) {
      extraInfo.push(`default: ${argument.defaultValueDescription || JSON.stringify(argument.defaultValue)}`);
    }
    if (extraInfo.length > 0) {
      const extraDescripton = `(${extraInfo.join(', ')})`;
      if (argument.description) {
        return `${argument.description} ${extraDescripton}`;
      }
      return extraDescripton;
    }
    return argument.description;
  }

  /**
   * Generate the built-in help text.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {string}
   */

  formatHelp(cmd, helper) {
    const termWidth = helper.padWidth(cmd, helper);
    const helpWidth = helper.helpWidth || 80;
    const itemIndentWidth = 2;
    const itemSeparatorWidth = 2; // between term and description
    function formatItem(term, description) {
      if (description) {
        const fullText = `${term.padEnd(termWidth)}${description}`;
        return helper.wrap(
          fullText,
          helpWidth,
          termWidth,
          40,
          0,
          itemIndentWidth,
          itemSeparatorWidth
        );
      }
      return ' '.repeat(itemIndentWidth) + term;
    }
    function formatList(textArray) {
      return textArray.join('\n');
    }

    // Usage
    let output = [`Usage: ${helper.commandUsage(cmd)}`, ''];

    // Description
    const commandDescription = helper.commandDescription(cmd);
    if (commandDescription.length > 0) {
      output = output.concat([helper.wrap(commandDescription, helpWidth, 0), '']);
    }

    // Arguments
    const argumentList = helper.visibleArguments(cmd).map((argument) => {
      return formatItem(helper.argumentTerm(argument), helper.argumentDescription(argument));
    });
    if (argumentList.length > 0) {
      output = output.concat(['Arguments:', formatList(argumentList), '']);
    }

    // Options
    const optionList = helper.visibleOptions(cmd).map((option) => {
      return formatItem(helper.optionTerm(option), helper.optionDescription(option));
    });
    if (optionList.length > 0) {
      output = output.concat(['Options:', formatList(optionList), '']);
    }

    if (this.showGlobalOptions) {
      const globalOptionList = helper.visibleGlobalOptions(cmd).map((option) => {
        return formatItem(helper.optionTerm(option), helper.optionDescription(option));
      });
      if (globalOptionList.length > 0) {
        output = output.concat(['Global Options:', formatList(globalOptionList), '']);
      }
    }

    // Commands
    const commandList = helper.visibleCommands(cmd).map((cmd) => {
      return formatItem(helper.subcommandTerm(cmd), helper.subcommandDescription(cmd));
    });
    if (commandList.length > 0) {
      output = output.concat(['Commands:', formatList(commandList), '']);
    }

    return output.join('\n');
  }

  /**
   * Calculate the pad width from the maximum term length.
   *
   * @param {Command} cmd
   * @param {Help} helper
   * @returns {number}
   */

  padWidth(cmd, helper) {
    return Math.max(
      helper.longestOptionTermLength(cmd, helper),
      helper.longestGlobalOptionTermLength(cmd, helper),
      helper.longestSubcommandTermLength(cmd, helper),
      helper.longestArgumentTermLength(cmd, helper)
    );
  }

  /**
   * Merge left table defined by first `leftTableLength` characters of `str` with right table defined by remaining characters, wrapping the output to `width - 1` characters per line. Table rows in both input and output are separated by line breaks.
   *
   * Do not wrap if right table text is manually formatted.
   *
   * Input table rows are indented by `globalIndent - Math.min(0, fullIndent)` and overflowing new table lines by `fullIndent` if it is positive and does not cause overflow display to be too narrow, where `fullIndent = globalIndent + leftTableWidth + tableGap + overflowShift` with `leftTableWidth` being the computed width of the left table. `leftTableWidth` and `tableGap` are omitted from the computation if right table text is manually formatted.
   *
   * `leftTableLength`, `overflowShift`, `globalIndent` and `tableGap` all default to 0.
   *
   * Overflow display is considered too narrow when available width is less than `minOverflowWidth` which defaults to 40.
   *
   * Unless `preformatted` is specified explicitly, right table text is considered manually formatted if it includes a line break followed by a whitespace.
   *
   * @param {string} str
   * @param {number} width
   * @param {number} [leftTableLength=0]
   * @param {number} [minOverflowWidth=40]
   * @param {number} [overflowShift=0]
   * @param {number} [globalIndent=0]
   * @param {number} [tableGap=0]
   * @param {boolean} [preformatted]
   * @return {string}
   */

  wrap(
    str,
    width,
    leftTableLength = 0,
    minOverflowWidth = 40,
    overflowShift = 0,
    globalIndent = 0,
    tableGap = 0,
    preformatted
  ) {
    // TODO: Error message
    if (width < 0 || leftTableLength < 0 || globalIndent < 0 || tableGap < 0) {
      throw new CommanderError(0, 'commander.helpWrapInvalidArgument', '');
    }

    if (width === undefined) width = Infinity;

    const newline = /\r?\n/;

    const leftTableLines = str.slice(0, leftTableLength).split(newline);
    const leftTableWidth = leftTableLines.reduce(
      (max, line) => Math.max(max, line.length), 0
    );
    leftTableLines.forEach((line, i) => {
      leftTableLines[i] = line.padEnd(leftTableWidth);
    });

    let rightTableText = str.slice(leftTableLength).replaceAll('\r\n', '\n');

    // Full \s characters, minus line terminatros (ECMAScript 12.3 Line Terminators)
    const whitespaces = '^\\S\n\r\u2028\u2029';
    if (preformatted === undefined) {
      // Detect manually wrapped and indented strings by searching for lines starting with spaces.
      const preformattedRegex = new RegExp(`\n[${whitespaces}]+`);
      preformatted = preformattedRegex.test(rightTableText);
    }
    const nowrap = preformatted || width === Number.POSITIVE_INFINITY;

    const lines = nowrap ? rightTableText.split(newline) : [];
    const missingLineCount = () => Math.max(
      0, leftTableLines.length - lines.length
    );
    const missingLineArray = () => Array(missingLineCount()).fill('');

    // If negative, used to indent expanded lines of previous table.
    // If positive, used to indent overflowing lines unless width is insufficient.
    // When computing the value, ignore indentation implied by table if preformatted.
    const fullIndent = globalIndent + Number(!preformatted) * (
      leftTableWidth + tableGap
    ) + overflowShift;

    const tableIndent = globalIndent - Math.min(0, fullIndent);
    let overflowIndent = fullIndent;

    let overflowWidth = width - overflowIndent;
    if (overflowIndent < 0 || overflowWidth < minOverflowWidth) {
      overflowIndent = 0;
      overflowWidth = width;
    }

    if (!nowrap) {
      const rightTableWidth = width - tableIndent - leftTableWidth - tableGap;

      const zeroWidthSpace = '\u200B';
      const breaks = `\\s${zeroWidthSpace}`;
      const breakGroupWithoutLF = `[^\\S\n]|${zeroWidthSpace}|$`;
      // Captured substring is used in code, so be careful with parentheses when changing the expression. Prefer non-capturing groups.
      const makeRegex = (width) => new RegExp( // minus one still necessary???
        // capture as much text as will fit in a column of width "width-1"
        `([^\n]{0,${width - 1}})` +
        // and collapse all following breaks except for \n at positions after first,
        `(?:\n|(?:${breakGroupWithoutLF})+\n?)` +
        // or match exactly width-1 non-breaking characters
        `|[^${breaks}]{${width - 1}}`,
        'y' // use lastIndex
      );
      const tableRegex = makeRegex(rightTableWidth);
      const overflowRegex = makeRegex(overflowWidth);

      let overflow = false;
      let regex = tableRegex;
      const setOverflow = (index) => {
        rightTableText = rightTableText.slice(index); // consume non-overflowing part
        overflow = true;
        regex = overflowRegex;
      };

      while (regex.lastIndex < rightTableText.length) { // input is not yet fully consumed
        const { 0: match, 1: line, index } = regex.exec(rightTableText);
        if (!overflow && overflowShift < 0 && line == null) {
          // If word does not fit in table, it might still fit in overflow when overflowShift is negative.
          // Leave column empty for cases when user wants to add previous columns / leading string manually afterwards.
          lines.push(...missingLineArray());
          setOverflow(index);
        } else {
          lines.push(line ?? match);
          if (!overflow && lines.length >= leftTableLines.length) {
            setOverflow(regex.lastIndex);
          }
        }
      }
    }

    const tableIndentString = ' '.repeat(tableIndent);
    const tableGapString = ' '.repeat(tableGap);
    const overflowIndentString = ' '.repeat(overflowIndent);

    return lines.concat(missingLineArray()).map((line, i) => {
      const prefix = i < leftTableLines.length
        ? tableIndentString + leftTableLines[i] + tableGapString
        : overflowIndentString;
      return preformatted
        ? line
          ? prefix + line
          : prefix.trimEnd() + line // prev table is assumed to not be preformatted
        : (prefix + line).trimEnd();
    }).join('\n');
  }
}

exports.Help = Help;
