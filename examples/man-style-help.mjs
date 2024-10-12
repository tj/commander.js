import { Command } from 'commander';

// Layout the help like a man page, with the description starting on the next line.

function formatItem(term, termWidth, description, helper) {
  const termIndent = 2;
  const descIndent = 6;
  const helpWidth = this.helpWidth || 80;

  // No need to pad term as on its own line.
  const lines = [' '.repeat(termIndent) + term];

  if (description) {
    const boxText = helper.boxWrap(description, helpWidth - 6);
    const descIndentText = ' '.repeat(descIndent);
    lines.push(
      descIndentText + boxText.split('\n').join('\n' + descIndentText),
    );
  }

  lines.push('');
  return lines.join('\n');
}

const program = new Command();

program.configureHelp({ formatItem });

program
  .option('-s', 'short flag')
  .option('-f, --flag', 'short and long flag')
  .option('--long <number>', 'l '.repeat(100));

program
  .command('sub1', 'sssss '.repeat(33))
  .command('sub2', 'subcommand 2 description');

program.parse();

// Try the following:
//    node man-style-help.mjs --help
