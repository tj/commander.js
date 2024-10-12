const { Command, Help, Option } = require('commander');

class MyHelp extends Help {
  constructor() {
    super();
    this.optionGroups = {};
  }

  visibleOptionGroups(cmd, helper) {
    const result = { 'Options:': [] };

    // Invert the optionGroups object to a map of optionName to groupName.
    const groupLookup = new Map();
    Object.keys(this.optionGroups)
      .concat()
      .forEach((title) => {
        result[title] = [];
        this.optionGroups[title].forEach((optionName) => {
          // (only supporting option appearing in one group for now, last one wins)
          groupLookup.set(optionName, title);
        });
      });

    // Build list of options in each group title (in order as returned by visibleOptions).
    helper.visibleOptions(cmd).forEach((option) => {
      const title = groupLookup.get(option.attributeName()) ?? 'Options:';
      result[title].push(option);
    });

    // Remove empty groups.
    Object.keys(result).forEach((title) => {
      if (result[title].length === 0) {
        delete result[title];
      }
    });

    return result;
  }

  formatOptions(formatItem, formatList, cmd, helper) {
    let output = [];
    const visibleOptionGroups = helper.visibleOptionGroups(cmd, helper);
    Object.keys(visibleOptionGroups).forEach((groupTitle) => {
      const optionList = visibleOptionGroups[groupTitle].map((opt) => {
        return formatItem(
          helper.optionTerm(opt),
          helper.optionDescription(opt),
        );
      });
      output = output.concat([groupTitle, formatList(optionList), '']);
    });
    return output;
  }
}

class MyCommand extends Command {
  createCommand(name) {
    return new MyCommand(name);
  }
  createHelp() {
    return Object.assign(new MyHelp(), this.configureHelp());
  }
}

const program = new MyCommand();

program
  .option('-c, --carbon')
  .option('-r, --rabbit', 'cuddly little friends')
  .option('-o, --oxygen')
  .addOption(new Option('-s, --sheep'))
  .option('--no-sheep') // negated
  .option('-n', 'neon') // short
  .option('--armadillo') // long
  .option('--zzz')
  .option('--dog', 'faithful furry companions')
  .option('--no-dog');

program.configureHelp({
  optionGroups: {
    'Animal Options:': ['rabbit', 'armadillo', 'sheep', 'dog'],
    'Element Options:': ['carbon', 'oxygen', 'n' /* neon */],
    'Help Options:': ['help'],
  },
});

program.parse();

// Try the following:
//    node help-option-groups.js --help
