# Commander.js

[![Build Status](https://github.com/tj/commander.js/workflows/build/badge.svg)](https://github.com/tj/commander.js/actions?query=workflow%3A%22build%22)
[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

完整的 [node.js](http://nodejs.org) 命令列解決方案。

使用其他語言閱讀：[English](./Readme.md) | [简体中文](./Readme_zh-CN.md) | 繁體中文

- [Commander.js](#commanderjs)
  - [安裝](#%E5%AE%89%E8%A3%9D)
  - [快速開始](#%E5%BF%AB%E9%80%9F%E9%96%8B%E5%A7%8B)
  - [宣告 program 變數](#%E5%AE%A3%E5%91%8A-program-%E8%AE%8A%E6%95%B8)
  - [選項](#%E9%81%B8%E9%A0%85)
    - [常用選項型別，boolean 型選項和帶引數的選項](#%E5%B8%B8%E7%94%A8%E9%81%B8%E9%A0%85%E5%9E%8B%E5%88%A5boolean-%E5%9E%8B%E9%81%B8%E9%A0%85%E5%92%8C%E5%B8%B6%E5%BC%95%E6%95%B8%E9%81%B8%E9%A0%85)
    - [選項的預設值](#%E9%81%B8%E9%A0%85%E7%9A%84%E9%A0%90%E8%A8%AD%E5%80%BC)
    - [其他的選項型別，取反選項，以及可選引數的選項](#%E5%85%B6%E4%BB%96%E7%9A%84%E9%81%B8%E9%A0%85%E5%9E%8B%E5%88%A5%EF%BC%8C%E5%8F%96%E5%8F%8D%E9%81%B8%E9%A0%85%EF%BC%8C%E4%BB%A5%E5%8F%8A%E5%8F%AF%E9%81%B8%E5%BC%95%E6%95%B8%E7%9A%84%E9%81%B8%E9%A0%85)
    - [必填選項](#%E5%BF%85%E5%A1%AB%E9%81%B8%E9%A0%85)
    - [變長引數選項](#%E8%AE%8A%E9%95%B7%E5%BC%95%E6%95%B8%E9%81%B8%E9%A0%85)
    - [版本選項](#%E7%89%88%E6%9C%AC%E9%81%B8%E9%A0%85)
    - [其他選項配置](#%E5%85%B6%E4%BB%96%E9%81%B8%E9%A0%85%E9%85%8D%E7%BD%AE)
    - [自訂選項處理](#%E8%87%AA%E8%A8%82%E9%81%B8%E9%A0%85%E8%99%95%E7%90%86)
  - [命令](#%E5%91%BD%E4%BB%A4)
    - [命令引數](#%E5%91%BD%E4%BB%A4%E5%BC%95%E6%95%B8)
      - [其他引數配置](#%E5%85%B6%E4%BB%96%E5%BC%95%E6%95%B8%E9%85%8D%E7%BD%AE)
      - [自訂引數處理](#%E8%87%AA%E8%A8%82%E5%BC%95%E6%95%B8%E8%99%95%E7%90%86)
    - [處理函式](#%E8%99%95%E7%90%86%E5%87%BD%E5%BC%8F)
    - [獨立的可執行（子）命令](#%E7%8D%A8%E7%AB%8B%E7%9A%84%E5%8F%AF%E5%9F%B7%E8%A1%8C%EF%BC%88%E5%AD%90%EF%BC%89%E5%91%BD%E4%BB%A4)
    - [生命週期鉤子](#%E7%94%9F%E5%91%BD%E9%80%B1%E6%9C%9F%E9%89%A4%E5%AD%90)
  - [自動化幫助資訊](#%E8%87%AA%E5%8B%95%E5%8C%96%E5%B9%AB%E5%8A%A9%E8%B3%87%E8%A8%8A)
    - [自訂幫助](#%E8%87%AA%E8%A8%82%E5%B9%AB%E5%8A%A9)
    - [在出錯後展示幫助資訊](#%E5%9C%A8%E5%87%BA%E9%8C%AF%E5%BE%8C%E5%B1%95%E7%A4%BA%E5%B9%AB%E5%8A%A9%E8%B3%87%E8%A8%8A)
    - [使用程式碼展示幫助資訊](#%E4%BD%BF%E7%94%A8%E7%A8%8B%E5%BC%8F%E7%A2%BC%E5%B1%95%E7%A4%BA%E5%B9%AB%E5%8A%A9%E8%B3%87%E8%A8%8A)
    - [.name](#name)
    - [.usage](#usage)
    - [.description 和 .summary](#description-%E5%92%8C-summary)
    - [.helpOption(flags, description)](#helpoptionflags-description)
    - [.addHelpCommand()](#addhelpcommand)
    - [其他幫助配置](#%E5%85%B6%E4%BB%96%E5%B9%AB%E5%8A%A9%E9%85%8D%E7%BD%AE)
  - [自訂事件監聽](#%E8%87%AA%E8%A8%82%E4%BA%8B%E4%BB%B6%E7%9B%A3%E8%81%BD)
  - [零碎知識](#%E9%9B%B6%E7%A2%8E%E7%9F%A5%E8%AD%98)
    - [.parse() 和 .parseAsync()](#parse-%E5%92%8C-parseasync)
    - [解析配置](#%E8%A7%A3%E6%9E%90%E9%85%8D%E7%BD%AE)
    - [作為屬性的遺留選項](#%E4%BD%9C%E7%82%BA%E5%B1%AC%E6%80%A7%E7%9A%84%E9%81%BA%E7%95%99%E9%81%B8%E9%A0%85)
    - [TypeScript](#typescript)
    - [createCommand()](#createCommand)
    - [Node 選項，如 --harmony](#node-%E9%81%B8%E9%A0%85%EF%BC%8C%E5%A6%82---harmony)
    - [除錯子命令](#%E9%99%A4%E9%8C%AF%E5%AD%90%E5%91%BD%E4%BB%A4)
    - [顯示錯誤](#%E9%A1%AF%E7%A4%BA%E9%8C%AF%E8%AA%A4)
    - [重寫退出和輸出](#%E9%87%8D%E5%AF%AB%E9%80%80%E5%87%BA%E5%92%8C%E8%BC%B8%E5%87%BA)
    - [其他文件](#%E5%85%B6%E4%BB%96%E6%96%87%E4%BB%B6)
  - [支援](#%E6%94%AF%E6%8F%B4)
    - [企業使用 Commander](#%E4%BC%81%E6%A5%AD%E4%BD%BF%E7%94%A8-commander)

關於本文件中使用的術語，請見[術語表](./docs/zh-CN/%E6%9C%AF%E8%AF%AD%E8%A1%A8.md)

## 安裝

```sh
npm install commander
```

## 快速開始

編寫程式碼來描述你的命令列介面。
Commander 負責將引數解析為選項和命令引數，為問題顯示使用錯誤，並實現一個有幫助的系統。

Commander 是嚴格的，並且會針對無法識別的選項顯示錯誤。
兩種最常用的選項型別是布林選項，和從引數中獲取值的選項。

示例程式碼：[split.js](./examples/split.js)

```js
const { program } = require('commander');

program
  .option('--first')
  .option('-s, --separator <char>')
  .argument('<string>');

program.parse();

const options = program.opts();
const limit = options.first ? 1 : undefined;
console.log(program.args[0].split(options.separator, limit));
```

```console
$ node split.js -s - --fits a-b-c
error: unknown option '--fits'
(Did you mean --first?)
$ node split.js -s - --first a-b-c
[ 'a' ]
```

這是一個使用子命令並帶有幫助描述的更完整的程式。在多命令程式中，每個命令（或命令的獨立執行檔）都有一個操作處理程序。

示例程式碼：[string-util.js](./examples/string-util.js)

```js
const { Command } = require('commander');
const program = new Command();

program
  .name('string-util')
  .description('CLI to some JavaScript string utilities')
  .version('0.8.0');

program.command('split')
  .description('Split a string into substrings and display as an array')
  .argument('<string>', 'string to split')
  .option('--first', 'display just the first substring')
  .option('-s, --separator <char>', 'separator character', ',')
  .action((str, options) => {
    const limit = options.first ? 1 : undefined;
    console.log(str.split(options.separator, limit));
  });

program.parse();
```

```console
$ node string-util.js help split
Usage: string-util split [options] <string>

Split a string into substrings and display as an array.

Arguments:
  string                  string to split

Options:
  --first                 display just the first substring
  -s, --separator <char>  separator character (default: ",")
  -h, --help              display help for command

$ node string-util.js split --separator=- a-b-c
[ 'a', 'b', 'c' ]
```

更多示例可以在 [examples](https://github.com/tj/commander.js/tree/master/examples) 目錄中找到。

## 宣告 program 變數

為簡化使用，Commander 提供了一個全域性物件。本文件的示例程式碼均按此方法使用：

```js
// CommonJS (.cjs)
const { program } = require('commander');
```

如果程式較為複雜，使用者需要以多種方式來使用 Commander，如單元測試等。建立本地 Command 物件是一種更好的方式：

```js
// CommonJS (.cjs)
const { Command } = require('commander');
const program = new Command();
```

```js
// ECMAScript (.mjs)
import { Command } from 'commander';
const program = new Command();
```

```ts
// TypeScript (.ts)
import { Command } from 'commander';
const program = new Command();
```

## 選項

Commander 使用`.option()`方法來定義選項，同時可以附加選項的簡介。每個選項可以定義一個短選項名稱（-後面接單個字元）和一個長選項名稱（--後面接一個或多個單詞），使用逗號、空格或`|`分隔。

解析後的選項可以通過`Command`物件上的`.opts()`方法獲取，同時會被傳遞給命令處理函式。

對於多個單詞的長選項，選項名會轉為駝峰命名法（camel-case），例如`--template-engine`選項可通過`program.opts().templateEngine`獲取。

選項及其選項引數可以用空格分隔，也可以組合成同一個引數。選項引數可以直接跟在短選項之後，也可以在長選項後面加上 `=`。

```sh
serve -p 80
serve -p80
serve --port 80
serve --port=80
```

`--`可以標記選項的結束，後續的引數均不會被命令解釋，可以正常使用。

預設情況下，選項在命令列中的順序不固定，一個選項可以在其他引數之前或之後指定。

當`.opts()`不夠用時，還有其他相關方法：

- `.optsWithGlobals()`返回合併的本地和全域性選項值
- `.getOptionValue()`和`.setOptionValue()`操作單個選項的值
- `.getOptionValueSource()`和`.setOptionValueWithSource()`包括選項值的來源

### 常用選項型別，boolean 型選項和帶引數選項

有兩種最常用的選項，一類是 boolean 型選項，選項無需配置引數，另一類選項則可以設定引數（使用尖括號宣告在該選項後，如`--expect <value>`）。如果在命令列中不指定具體的選項及引數，則會被定義為`undefined`。

示例程式碼：[options-common.js](./examples/options-common.js)

```js
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

const options = program.opts();
if (options.debug) console.log(options);
console.log('pizza details:');
if (options.small) console.log('- small pizza size');
if (options.pizzaType) console.log(`- ${options.pizzaType}`);
```

```console
$ pizza-options -p
error: option '-p, --pizza-type <type>' argument missing
$ pizza-options -d -s -p vegetarian
{ debug: true, small: true, pizzaType: 'vegetarian' }
pizza details:
- small pizza size
- vegetarian
$ pizza-options --pizza-type=cheese
pizza details:
- cheese
```

多個布林短選項可以在破折號之後組合在一起，並且可以跟一個取值的單一選項。
例如 `-d -s -p cheese` 可以寫成 `-ds -p cheese` 甚至 `-dsp cheese`。

具有預期選項引數的選項是貪婪的，並且無論值如何，都會消耗引數。
所以 `--id -xyz` 讀取 `-xyz` 作為選項引數。

通過`program.parse(arguments)`方法處理引數，沒有被使用的選項會存放在`program.args`陣列中。該方法的引數是可選的，預設值為`process.argv`。

### 選項的預設值

選項可以設定一個預設值。

示例程式碼：[options-defaults.js](./examples/options-defaults.js)

```js
program
  .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue');

program.parse();

console.log(`cheese: ${program.opts().cheese}`);
```

```console
$ pizza-options
cheese: blue
$ pizza-options --cheese stilton
cheese: stilton
```

### 其他的選項型別，取反選項，以及可選引數的選項

可以定義一個以`no-`開頭的 boolean 型長選項。在命令列中使用該選項時，會將對應選項的值置為`false`。當只定義了帶`no-`的選項，未定義對應不帶`no-`的選項時，該選項的預設值會被置為`true`。

如果已經定義了`--foo`，那麼再定義`--no-foo`並不會改變它本來的預設值。

示例程式碼：[options-negatable.js](./examples/options-negatable.js)

```js
program
  .option('--no-sauce', 'Remove sauce')
  .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
  .option('--no-cheese', 'plain with no cheese')
  .parse();

const options = program.opts();
const sauceStr = options.sauce ? 'sauce' : 'no sauce';
const cheeseStr = (options.cheese === false) ? 'no cheese' : `${options.cheese} cheese`;
console.log(`You ordered a pizza with ${sauceStr} and ${cheeseStr}`);
```

```console
$ pizza-options
You ordered a pizza with sauce and mozzarella cheese
$ pizza-options --sauce
error: unknown option '--sauce'
$ pizza-options --cheese=blue
You ordered a pizza with sauce and blue cheese
$ pizza-options --no-sauce --no-cheese
You ordered a pizza with no sauce and no cheese
```

選項的引數使用方括號宣告表示引數是可選引數（如`--optional [value]`）。該選項在不帶引數時可用作 boolean 選項，在帶有引數時則從引數中得到值。

示例程式碼：[options-boolean-or-value.js](./examples/options-boolean-or-value.js)

```js
program
  .option('-c, --cheese [type]', 'Add cheese with optional type');

program.parse(process.argv);

const options = program.opts();
if (options.cheese === undefined) console.log('no cheese');
else if (options.cheese === true) console.log('add cheese');
else console.log(`add cheese type ${options.cheese}`);
```

```console
$ pizza-options
no cheese
$ pizza-options --cheese
add cheese
$ pizza-options --cheese mozzarella
add cheese type mozzarella
```

帶有可選選項引數的選項不是貪婪的，並且會忽略以破折號開頭的引數。因此對於`--id -5`，`id`表現為布林選項，但如果需要，您可以使用組合形式，例如 `--id=-5`。

關於可能有歧義的用例，請見[可變引數的選項](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)。

### 必填選項

通過`.requiredOption()`方法可以設定選項為必填。必填選項要麼設有預設值，要麼必須在命令列中輸入，對應的屬性欄位在解析時必定會有賦值。該方法其餘引數與`.option()`一致。

示例程式碼：[options-required.js](./examples/options-required.js)

```js
program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse();
```

```console
$ pizza
error: required option '-c, --cheese <type>' not specified
```

### 變長引數選項

定義選項時，可以通過使用`...`來設定引數為可變長引數。在命令列中，使用者可以輸入多個引數，解析後會以陣列形式儲存在對應屬性欄位中。在輸入下一個選項前（`-`或`--`開頭），使用者輸入的指令均會被視作變長引數。與普通引數一樣的是，可以通過`--`標記當前命令的結束。

示例程式碼：[options-variadic.js](./examples/options-variadic.js)

```js
program
  .option('-n, --number <numbers...>', 'specify numbers')
  .option('-l, --letter [letters...]', 'specify letters');

program.parse();

console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);
```

```console
$ collect -n 1 2 3 --letter a b c
Options:  { number: [ '1', '2', '3' ], letter: [ 'a', 'b', 'c' ] }
Remaining arguments:  []
$ collect --letter=A -n80 operand
Options:  { number: [ '80' ], letter: [ 'A' ] }
Remaining arguments:  [ 'operand' ]
$ collect --letter -n 1 -n 2 3 -- operand
Options:  { number: [ '1', '2', '3' ], letter: true }
Remaining arguments:  [ 'operand' ]
```

關於可能有歧義的用例，請見[可變引數的選項](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)。

### 版本選項

`.version()`方法可以設定版本，其預設選項為`-V`和`--version`，設定了版本後，命令列會輸出當前的版本號。

```js
program.version('0.0.1');
```

```console
$ ./examples/pizza -V
0.0.1
```

版本選項也支援自訂設定選項名稱，可以在`.version()`方法裡再傳遞一些引數（長選項名稱、描述資訊），用法與`.option()`方法類似。

```bash
program.version('0.0.1', '-v, --vers', 'output the current version');
```

### 其他選項配置

大多數情況下，選項均可通過`.option()`方法新增。但對某些不常見的用例，也可以直接構造`Option`物件，對選項進行更詳盡的配置。

示例程式碼：[options-extra.js](./examples/options-extra.js), [options-env.js](./examples/options-env.js), [options-conflicts.js](./examples/options-conflicts.js), [options-implies.js](./examples/options-implies.js)

```js
program
  .addOption(new Option('-s, --secret').hideHelp())
  .addOption(new Option('-t, --timeout <delay>', 'timeout in seconds').default(60, 'one minute'))
  .addOption(new Option('-d, --drink <size>', 'drink size').choices(['small', 'medium', 'large']))
  .addOption(new Option('-p, --port <number>', 'port number').env('PORT'))
  .addOption(new Option('--donate [amount]', 'optional donation in dollars').preset('20').argParser(parseFloat))
  .addOption(new Option('--disable-server', 'disables the server').conflicts('port'))
  .addOption(new Option('--free-drink', 'small drink included free ').implies({ drink: 'small' }));
```

```console
$ extra --help
Usage: help [options]

Options:
  -t, --timeout <delay>  timeout in seconds (default: one minute)
  -d, --drink <size>     drink cup size (choices: "small", "medium", "large")
  -p, --port <number>    port number (env: PORT)
  --donate [amount]      optional donation in dollars (preset: "20")
  --disable-server       disables the server
  --free-drink           small drink included free
  -h, --help             display help for command

$ extra --drink huge
error: option '-d, --drink <size>' argument 'huge' is invalid. Allowed choices are small, medium, large.

$ PORT=80 extra --donate --free-drink
Options:  { timeout: 60, donate: 20, port: '80', freeDrink: true, drink: 'small' }

$ extra --disable-server --port 8000
error: option '--disable-server' cannot be used with option '-p, --port <number>'
```

### 自訂選項處理

選項的引數可以通過自訂函式來處理，該函式接收兩個引數，即使用者新輸入的引數值和當前已有的引數值（即上一次呼叫自訂處理函式後的返回值），返回新的選項引數值。

自訂函式適用場景包括引數型別轉換，引數暫存，或者其他自訂處理的場景。

可以在自訂函式的後面設定選項引數的預設值或初始值（例如引數用列表暫存時需要設定一個初始空列表)。

示例程式碼：[options-custom-processing.js](./examples/options-custom-processing.js)

```js
function myParseInt(value, dummyPrevious) {
  // parseInt 参数为字符串和进制数
  const parsedValue = parseInt(value, 10);
  if (isNaN(parsedValue)) {
    throw new commander.InvalidArgumentError('Not a number.');
  }
  return parsedValue;
}

function increaseVerbosity(dummyValue, previous) {
  return previous + 1;
}

function collect(value, previous) {
  return previous.concat([value]);
}

function commaSeparatedList(value, dummyPrevious) {
  return value.split(',');
}

program
  .option('-f, --float <number>', 'float argument', parseFloat)
  .option('-i, --integer <number>', 'integer argument', myParseInt)
  .option('-v, --verbose', 'verbosity that can be increased', increaseVerbosity, 0)
  .option('-c, --collect <value>', 'repeatable value', collect, [])
  .option('-l, --list <items>', 'comma separated list', commaSeparatedList)
;

program.parse();

const options = program.opts();
if (options.float !== undefined) console.log(`float: ${options.float}`);
if (options.integer !== undefined) console.log(`integer: ${options.integer}`);
if (options.verbose > 0) console.log(`verbosity: ${options.verbose}`);
if (options.collect.length > 0) console.log(options.collect);
if (options.list !== undefined) console.log(options.list);
```

```console
$ custom -f 1e2
float: 100
$ custom --integer 2
integer: 2
$ custom -v -v -v
verbose: 3
$ custom -c a -c b -c c
[ 'a', 'b', 'c' ]
$ custom --list x,y,z
[ 'x', 'y', 'z' ]
```

## 命令

通過`.command()`或`.addCommand()`可以配置命令，有兩種實現方式：為命令繫結處理函式，或者將命令單獨寫成一個執行檔（詳述見後文）。子命令支援巢狀（[示例程式碼](./examples/nestedCommands.js)）。

`.command()`的第一個引數為命令名稱。命令引數可以跟在名稱後面，也可以用`.argument()`單獨指定。引數可為必選的（尖括號表示）、可選的（方括號表示）或變長引數（點號表示，如果使用，只能是最後一個引數）。

使用`.addCommand()`向`program`增加配置好的子命令。

例如:

```js
// 通过绑定处理函数实现命令（这里的指令描述为放在`.command`中）
// 返回新生成的命令（即该子命令）以供继续配置
program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  });

// 通过独立的的可执行文件实现命令 (注意这里指令描述是作为`.command`的第二个参数)
// 返回最顶层的命令以供继续添加子命令
program
  .command('start <service>', 'start named service')
  .command('stop [service]', 'stop named service, or all if no name supplied');

// 分别装配命令
// 返回最顶层的命令以供继续添加子命令
program
  .addCommand(build.makeBuildCommand());
```

使用`.command()`和`addCommand()`來指定選項的相關設定。當設定`hidden: true`時，該命令不會列印在幫助資訊裡。當設定`isDefault: true`時，若沒有指定其他子命令，則會預設執行這個命令（[樣例](./examples/defaultCommand.js)）。

### 命令引數

如上所述，子命令的引數可以通過`.command()`指定。對於有獨立執行檔的子命令來說，引數只能以這種方法指定。而對其他子命令，引數也可用以下方法。

在`Command`物件上使用`.argument()`來按次序指定命令引數。該方法接受引數名稱和引數描述。引數可為必選的（尖括號表示，例如`<required>`）或可選的（方括號表示，例如`[optional]`）。

示例程式碼：[argument.js](./examples/argument.js)

```js
program
  .version('0.1.0')
  .argument('<username>', 'user to login')
  .argument('[password]', 'password for user, if required', 'no password given')
  .action((username, password) => {
    console.log('username:', username);
    console.log('password:', password);
  });
```

在引數名後加上`...`來宣告可變引數，且只有最後一個引數支援這種用法。可變引數會以陣列的形式傳遞給處理函式。例如：

```js
program
  .version('0.1.0')
  .command('rmdir')
  .argument('<dirs...>')
  .action(function (dirs) {
    dirs.forEach((dir) => {
      console.log('rmdir %s', dir);
    });
  });
```

有一種便捷方式可以一次性指定多個引數，但不包含引數描述：

```js
program
  .arguments('<username> <password>');
```

#### 其他引數配置

有少數附加功能可以直接構造`Argument`物件，對引數進行更詳盡的配置。

示例程式碼：[arguments-extra.js](./examples/arguments-extra.js)

```js
program
  .addArgument(new commander.Argument('<drink-size>', 'drink cup size').choices(['small', 'medium', 'large']))
  .addArgument(new commander.Argument('[timeout]', 'timeout in seconds').default(60, 'one minute'))
```

#### 自訂引數處理

選項的引數可以通過自訂函式來處理（與處理選項引數時類似），該函式接收兩個引數：使用者新輸入的引數值和當前已有的引數值（即上一次呼叫自訂處理函式後的返回值），返回新的命令引數值。

處理後的引數值會傳遞給命令處理函式，同時可通過`.processedArgs`獲取。

可以在自訂函式的後面設定命令引數的預設值或初始值。

示例程式碼：[arguments-custom-processing.js](./examples/arguments-custom-processing.js)

```js
program
  .command('add')
  .argument('<first>', 'integer argument', myParseInt)
  .argument('[second]', 'integer argument', myParseInt, 1000)
  .action((first, second) => {
    console.log(`${first} + ${second} = ${first + second}`);
  })
;
```

### 處理函式

命令處理函式的引數，為該命令宣告的所有引數，除此之外還會附加兩個額外引數：一個是解析出的選項，另一個則是該命令物件自身。

示例程式碼：[thank.js](./examples/thank.js)

```js
program
  .argument('<name>')
  .option('-t, --title <honorific>', 'title to use before name')
  .option('-d, --debug', 'display some debugging')
  .action((name, options, command) => {
    if (options.debug) {
      console.error('Called %s with options %o', command.name(), options);
    }
    const title = options.title ? `${options.title} ` : '';
    console.log(`Thank-you ${title}${name}`);
  });
```

如果你願意，你可以跳過為處理函式宣告引數直接使用 command。 `this` 關鍵字設定為執行命令，可以在函式表示式中使用（但不能從箭頭函式中使用）。

示例程式碼：[action-this.js](./examples/action-this.js)

```js
program
  .command('serve')
  .argument('<script>')
  .option('-p, --port <number>', 'port number', 80)
  .action(function() {
    console.error('Run script %s on port %s', this.args[0], this.opts().port);
  });
```

處理函式支援`async`，相應的，需要使用`.parseAsync`代替`.parse`。

```js
async function run() { /* 在这里编写代码 */ }

async function main() {
  program
    .command('run')
    .action(run);
  await program.parseAsync(process.argv);
}
```

使用命令時，所給的選項和命令引數會被驗證是否有效。凡是有未知的選項，或缺少所需的命令引數，都會報錯。
如要允許使用未知的選項，可以呼叫`.allowUnknownOption()`。預設情況下，傳入過多的引數並不報錯，但也可以通過呼叫`.allowExcessArguments(false)`來啟用過多引數的報錯。

### 獨立的可執行（子）命令

當`.command()`帶有描述引數時，就意味著使用獨立的執行檔作為子命令。
Commander 會嘗試在入口指令碼的目錄中搜索名稱組合為 `command-subcommand` 的檔案，如以下示例中的 `pm-install` 或 `pm-search`。搜尋包括嘗試常見的副檔名，如`.js`。
你可以使用 `executableFile` 配置選項指定自訂名稱（和路徑）。
你可以使用 `.executableDir()` 為子命令指定自訂搜尋目錄。

你可以在執行檔裡處理（子）命令的選項，而不必在頂層宣告它們。

示例程式碼：[pm](./examples/pm)

```js
program
  .name('pm')
  .version('0.1.0')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('update', 'update installed packages', { executableFile: 'myUpdateSubCommand' })
  .command('list', 'list packages installed', { isDefault: true });

program.parse(process.argv);
```

如果該命令需要支援全域性安裝，請確保有對應的權限，例如`755`。

### 生命週期鉤子

可以在命令的生命週期事件上設定回撥函式。

示例程式碼：[hook.js](./examples/hook.js)

```js
program
  .option('-t, --trace', 'display trace statements for commands')
  .hook('preAction', (thisCommand, actionCommand) => {
    if (thisCommand.opts().trace) {
      console.log(`About to call action handler for subcommand: ${actionCommand.name()}`);
      console.log('arguments: %O', actionCommand.args);
      console.log('options: %o', actionCommand.opts());
    }
  });
```

鉤子函式支援`async`，相應的，需要使用`.parseAsync`代替`.parse`。一個事件上可以新增多個鉤子。

支援的事件有：

| 事件名稱 | 觸發時機 | 引數列表 |
| :-- | :-- | :-- |
| `preAction`, `postAction` | 本命令或其子命令的處理函式執行前/後 |   `(thisCommand, actionCommand)` |
| `preSubcommand` | 在其直接子命令解析之前呼叫  | `(thisCommand, subcommand)` |

## 自動化幫助資訊

幫助資訊是 Commander 基於你的程式自動生成的，預設的幫助選項是`-h,--help`。

示例程式碼：[pizza](./examples/pizza)

```console
$ node ./examples/pizza --help
Usage: pizza [options]

An application for pizza ordering

Options:
  -p, --peppers        Add peppers
  -c, --cheese <type>  Add the specified type of cheese (default: "marble")
  -C, --no-cheese      You do not want any cheese
  -h, --help           display help for command
```

如果你的命令中包含了子命令，會預設新增`help`命令，它可以單獨使用，也可以與子命令一起使用來提示更多幫助資訊。用法與`shell`程式類似：

```sh
shell help
shell --help

shell help spawn
shell spawn --help
```

### 自訂幫助

可以新增額外的幫助資訊，與內建的幫助一同展示。

示例程式碼：[custom-help](./examples/custom-help)

```js
program
  .option('-f, --foo', 'enable some foo');

program.addHelpText('after', `

Example call:
  $ custom-help --help`);
```

將會輸出以下的幫助資訊：

```Text
Usage: custom-help [options]

Options:
  -f, --foo   enable some foo
  -h, --help  display help for command

Example call:
  $ custom-help --help
```

位置引數對應的展示方式如下：

- `beforeAll`：作為全域性標頭欄展示
- `before`：在內建幫助資訊之前展示
- `after`：在內建幫助資訊之後展示
- `afterAll`：作為全域性末尾欄展示

`beforeAll`和`afterAll`兩個引數作用於命令及其所有的子命令。

第二個引數可以是一個字串，也可以是一個返回字串的函式。對後者而言，為便於使用，該函式可以接受一個上下文物件，它有如下屬性：

- `error`：boolean 值，代表該幫助資訊是否由於不當使用而展示
- `command`：代表展示該幫助資訊的`Command`物件

### 在出錯後展示幫助資訊

預設情況下，出現命令用法錯誤時只會顯示錯誤資訊。可以選擇在出錯後展示完整的幫助或自訂的幫助資訊。

```js
program.showHelpAfterError();
// 或者
program.showHelpAfterError('(add --help for additional information)');
```

```console
$ pizza --unknown
error: unknown option '--unknown'
(add --help for additional information)
```

預設行為是在出現未知命令或選項錯誤後建議正確拼寫。你可以停用此功能。

```js
program.showSuggestionAfterError(false);
```

```console
$ pizza --hepl
error: unknown option '--hepl'
(Did you mean --help?)
```

### 使用程式碼展示幫助資訊

`.help()`：展示幫助資訊並退出。可以通過傳入`{ error: true }`來讓幫助資訊從 stderr 輸出，並以代表錯誤的狀態碼退出程式。

`.outputHelp()`：只展示幫助資訊，不退出程式。傳入`{ error: true }`可以讓幫助資訊從 stderr 輸出。

`.helpInformation()`：得到字串形式的內建的幫助資訊，以便用於自訂的處理及展示。

### .name

命令名稱出現在幫助中，也用於定位獨立的可執行子命令。

你可以使用 `.name()` 或在 Command 建構函式中指定程式名稱。對於 program ，Commander 會使用傳遞給 `.parse()` 的完整引數中的指令碼名稱。但是，指令碼名稱會根據程式的啟動方式而有所不同，因此您可能希望明確指定它。

```js
program.name('pizza');
const pm = new Command('pm');
```

使用 `.command()` 指定時，子命令會獲得名稱。如果您自己建立子命令以與 `.addCommand()` 一起使用，則使用 `.name()` 或在 Command 建構函式中設定名稱。

### .usage

通過這個選項可以修改幫助資訊的首行提示，例如：

```js
program
  .name("my-command")
  .usage("[global options] command")
```

幫助資訊開頭如下：

```Text
Usage: my-command [global options] command
```

### .description 和 .summary

description 出現在命令的幫助中。當列為程式的子命令時，你可以選擇提供更短的 summary 以供使用。

```js
program
  .command("duplicate")
  .summary("make a copy")
  .description(`Make a copy of the current project.
This may require additional disk space.
  `);
```

### .helpOption(flags, description)

每一個命令都帶有一個預設的幫助選項。你可以改變 `flags` 和 `description` 引數。傳入 `false` 則會停用內建的幫助資訊。

```js
program
  .helpOption('-e, --HELP', 'read more information');
```

### .addHelpCommand()

如果一個命令擁有子命令，它也將有一個預設的幫助子命令。使用`.addHelpCommand()`和`.addHelpCommand(false)`可以開啟或關閉預設的幫助子命令。

也可以自訂名字和描述：

```js
program.addHelpCommand('assist [command]', 'show assistance');
```

### 其他幫助配置

內建幫助資訊通過`Help`類進行格式化。如有需要，可以使用`.configureHelp()`來更改其資料屬性和方法，或使用`.createHelp()`來建立子類，從而配置`Help`類的行為。

資料屬性包括：

- `helpWidth`：指明幫助資訊的寬度。可在單元測試中使用。
- `sortSubcommands`：以字母序排列子命令
- `sortOptions`：以字母序排列選項

可以得到視覺化的引數列表，選項列表，以及子命令列表。列表的每個元素都具有`_term_`和`_description_`屬性，並可以對其進行格式化。關於其使用方式，請參考`.formatHelp()`。

示例程式碼：[configure-help.js](./examples/configure-help.js)

```js
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() // 显示名称，而非用法
});
```

## 自訂事件監聽

監聽命令和選項可以執行自訂函式。

```js
program.on('option:verbose', function () {
  process.env.VERBOSE = this.opts().verbose;
});
```

## 零碎知識

### .parse() 和 .parseAsync()

`.parse`的第一個引數是要解析的字串陣列，也可以省略引數而使用`process.argv`。

如果引數遵循與 node 不同的約定，可以在第二個引數中傳遞`from`選項：

- `node`：預設值，`argv[0]`是應用，`argv[1]`是要跑的指令碼，後續為使用者引數；
- `electron`：`argv[1]`根據 electron 應用是否打包而變化；
- `user`：來自使用者的所有引數。

例如：

```js
program.parse(process.argv); // 指明，按 node 约定
program.parse(); // 默认，自动识别 electron
program.parse(['-f', 'filename'], { from: 'user' });
```

### 解析配置

當預設的解析方式無法滿足需要，Commander 也提供了其他的解析行為。

預設情況下，程式的選項在子命令前後均可被識別。如要只允許選項出現在子命令之前，可以使用`.enablePositionalOptions()`。這樣可以在命令和子命令中使用意義不同的同名選項。

示例程式碼：[positional-options.js](./examples/positional-options.js)

當啟用了帶順序的選項解析，以下程式中，`-b`選項在第一行中將被解析為程式頂層的選項，而在第二行中則被解析為子命令的選項：

```sh
program -b subcommand
program subcommand -b
```

預設情況下，選項在命令引數前後均可被識別。如要使選項僅在命令引數前被識別，可以使用`.passThroughOptions()`。這樣可以把引數和跟隨的選項傳遞給另一程式，而無需使用`--`來終止選項解析。
如要在子命令中使用此功能，必須首先啟用帶順序的選項解析。

示例程式碼：[pass-through-options.js](./examples/pass-through-options.js)

當啟用此功能時，以下程式中，`--port=80`在第一行中會被解析為程式的選項，而在第二行中則會被解析為一個命令引數：

```sh
program --port=80 arg
program arg --port=80
```

預設情況下，使用未知選項會提示錯誤。如要將未知選項視作普通命令引數，並繼續處理其他部分，可以使用`.allowUnknownOption()`。這樣可以混用已知和未知的選項。

預設情況下，傳入過多的命令引數並不會報錯。可以使用`.allowExcessArguments(false)`來啟用這一檢查。

### 作為屬性的遺留選項

在 Commander 7 以前，選項的值是作為屬性儲存在命令物件上的。
這種處理方式便於實現，但缺點在於，選項可能會與`Command`的已有屬性相沖突。通過使用`.storeOptionsAsProperties()`，可以恢復到這種舊的處理方式，並可以不加改動地繼續執行遺留程式碼。

```js
program
  .storeOptionsAsProperties()
  .option('-d, --debug')
  .action((commandAndOptions) => {
    if (commandAndOptions.debug) {
      console.error(`Called ${commandAndOptions.name()}`);
    }
  });
```

### TypeScript

如果你使用 ts-node，並有`.ts`檔案作為獨立執行檔，那麼需要用 node 執行你的程式以使子命令能正確呼叫，例如：

```sh
node -r ts-node/register pm.ts
```

### createCommand()

使用這個工廠方法可以建立新命令，此時不需要使用`new`，如

```bash
const { createCommand } = require('commander');
const program = createCommand();
```

`createCommand`同時也是`Command`物件的一個方法，可以建立一個新的命令（而非子命令），使用`.command()`建立子命令時內部會呼叫該方法，具體使用方式可參考 [custom-command-class.js](./examples/custom-command-class.js)。

### Node 選項，如 --harmony

要使用`--harmony`等選項有以下兩種方式：

- 在子命令指令碼中加上`#!/usr/bin/env node --harmony`。注：Windows 系統不支援；
- 呼叫時加上`--harmony`引數，例如`node --harmony examples/pm publish`。`--harmony`選項在開啟子程序時仍會保留。

### 除錯子命令

一個可執行的子命令會作為單獨的子程序執行。

如果使用 node inspector 的`node -inspect`等命令來[除錯](https://nodejs.org/en/docs/guides/debugging-getting-started/)可執行命令，對於生成的子命令，inspector 埠會遞增 1。

如果想使用 VSCode 除錯，則需要在`launch.json`設定檔裡設定`"autoAttachChildProcesses": true`。

### 顯示錯誤

你可用於針對自己的錯誤情況呼叫 Commander 錯誤處理。（另請參閱下一節有關退出處理的內容）

除了錯誤訊息，你還可以選擇指定 `exitCode`（與 `process.exit` 一起使用）和 `code`（與 `CommanderError` 一起使用）

```js
program.error('Password must be longer than four characters');
program.error('Custom processing has failed', { exitCode: 2, code: 'my.custom.error' });
```

### 重寫退出和輸出

預設情況下，在檢測到錯誤、列印幫助資訊或版本資訊時 Commander 會呼叫`process.exit`方法。其預設實現會丟擲一個`CommanderError`，可以重寫該方法並提供一個回撥函式（可選）。

回撥函式的引數為`CommanderError`，屬性包括 Number 型的`exitCode`、String 型的`code`和`message`。子命令完成呼叫後會開始非同步處理。正常情況下，列印錯誤資訊、幫助資訊或版本資訊不會被重寫影響，因為重寫會發生在列印之後。

```js
program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  // 自定义处理...
}
```

Commander 預設用作命令列應用，其輸出寫入 stdout 和 stderr。
對於其他應用型別，這一行為可以修改。並且可以修改錯誤資訊的展示方式。

示例程式碼：[configure-output.js](./examples/configure-output.js)

```js
function errorColor(str) {
  // 添加 ANSI 转义字符，以将文本输出为红色
  return `\x1b[31m${str}\x1b[0m`;
}

program
  .configureOutput({
    // 此处使输出变得容易区分
    writeOut: (str) => process.stdout.write(`[OUT] ${str}`),
    writeErr: (str) => process.stdout.write(`[ERR] ${str}`),
    // 将错误高亮显示
    outputError: (str, write) => write(errorColor(str))
  });
```

### 其他文件

請參考關於如下話題的其他文件：

- [不再推薦使用的功能](./docs/zh-CN/%E4%B8%8D%E5%86%8D%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%E7%9A%84%E5%8A%9F%E8%83%BD.md)。這些功能仍受到支援，以保證向後相容。
- [可變引數的選項](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)

## 支援

當前版本的 Commander 在 LTS 版本的 Node.js 上完全支援。並且至少需要 v22.12。
（使用更低版本 Node.js 的使用者建議安裝更低版本的 Commander）

社群支援請訪問專案的 [Issues](https://github.com/tj/commander.js/issues)。

### 企業使用 Commander

作為 Tidelift 訂閱的一部分。

Commander 和很多其他包的維護者已與 Tidelift 合作，面向企業提供開源依賴的商業支援與維護。企業可以向相關依賴包的維護者支付一定的費用，幫助企業節省時間，降低風險，改進程式碼執行情況。[瞭解更多](https://tidelift.com/subscription/pkg/npm-commander?utm_source=npm-commander&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)
