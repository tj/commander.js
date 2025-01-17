# Commander.js

[![Build Status](https://github.com/tj/commander.js/workflows/build/badge.svg)](https://github.com/tj/commander.js/actions?query=workflow%3A%22build%22)
[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

完整的 [node.js](http://nodejs.org) 命令行解决方案。

使用其他语言阅读：[English](./Readme.md) | 简体中文

- [Commander.js](#commanderjs)
  - [安装](#%e5%ae%89%e8%a3%85)
  - [快速开始](#%E5%BF%AB%E9%80%9F%E5%BC%80%E5%A7%8B)
  - [声明 program 变量](#%e5%a3%b0%e6%98%8e-program-%e5%8f%98%e9%87%8f)
  - [选项](#%e9%80%89%e9%a1%b9)
    - [常用选项类型，boolean 型选项和带参数的选项](#%e5%b8%b8%e7%94%a8%e9%80%89%e9%a1%b9%e7%b1%bb%e5%9e%8bboolean-%e5%9e%8b%e9%80%89%e9%a1%b9%e5%92%8c%e5%b8%a6%e5%8f%82%e6%95%b0%e9%80%89%e9%a1%b9)
    - [选项的默认值](#%E9%80%89%E9%A1%B9%E7%9A%84%E9%BB%98%E8%AE%A4%E5%80%BC)
    - [其他的选项类型，取反选项，以及可选参数的选项](#%E5%85%B6%E4%BB%96%E7%9A%84%E9%80%89%E9%A1%B9%E7%B1%BB%E5%9E%8B%EF%BC%8C%E5%8F%96%E5%8F%8D%E9%80%89%E9%A1%B9%EF%BC%8C%E4%BB%A5%E5%8F%8A%E5%8F%AF%E9%80%89%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9)
    - [必填选项](#%e5%bf%85%e5%a1%ab%e9%80%89%e9%a1%b9)
    - [变长参数选项](#%e5%8f%98%e9%95%bf%e5%8f%82%e6%95%b0%e9%80%89%e9%a1%b9)
    - [版本选项](#%e7%89%88%e6%9c%ac%e9%80%89%e9%a1%b9)
    - [其他选项配置](#%E5%85%B6%E4%BB%96%E9%80%89%E9%A1%B9%E9%85%8D%E7%BD%AE)
    - [自定义选项处理](#%E8%87%AA%E5%AE%9A%E4%B9%89%E9%80%89%E9%A1%B9%E5%A4%84%E7%90%86)
  - [命令](#%e5%91%bd%e4%bb%a4)
    - [命令参数](#%E5%91%BD%E4%BB%A4%E5%8F%82%E6%95%B0)
      - [其他参数配置](#%E5%85%B6%E4%BB%96%E5%8F%82%E6%95%B0%E9%85%8D%E7%BD%AE)
      - [自定义参数处理](#%E8%87%AA%E5%AE%9A%E4%B9%89%E5%8F%82%E6%95%B0%E5%A4%84%E7%90%86)
    - [处理函数](#%E5%A4%84%E7%90%86%E5%87%BD%E6%95%B0)
    - [独立的可执行（子）命令](#%E7%8B%AC%E7%AB%8B%E7%9A%84%E5%8F%AF%E6%89%A7%E8%A1%8C%EF%BC%88%E5%AD%90%EF%BC%89%E5%91%BD%E4%BB%A4)
    - [生命周期钩子](#%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F%E9%92%A9%E5%AD%90)
  - [自动化帮助信息](#%e8%87%aa%e5%8a%a8%e5%8c%96%e5%b8%ae%e5%8a%a9%e4%bf%a1%e6%81%af)
    - [自定义帮助](#%e8%87%aa%e5%ae%9a%e4%b9%89%e5%b8%ae%e5%8a%a9)
    - [在出错后展示帮助信息](#%E5%9C%A8%E5%87%BA%E9%94%99%E5%90%8E%E5%B1%95%E7%A4%BA%E5%B8%AE%E5%8A%A9%E4%BF%A1%E6%81%AF)
    - [使用代码展示帮助信息](#%E4%BD%BF%E7%94%A8%E4%BB%A3%E7%A0%81%E5%B1%95%E7%A4%BA%E5%B8%AE%E5%8A%A9%E4%BF%A1%E6%81%AF)
    - [.name](#name)
    - [.usage](#usage)
    - [.description 和 .summary](#description-%E5%92%8C-summary)
    - [.helpOption(flags, description)](#helpoptionflags-description)
    - [.addHelpCommand()](#addhelpcommand)
    - [其他帮助配置](#%E5%85%B6%E4%BB%96%E5%B8%AE%E5%8A%A9%E9%85%8D%E7%BD%AE)
  - [自定义事件监听](#%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6%e7%9b%91%e5%90%ac)
  - [零碎知识](#%e9%9b%b6%e7%a2%8e%e7%9f%a5%e8%af%86)
    - [.parse() 和 .parseAsync()](#parse-%e5%92%8c-parseasync)
    - [解析配置](#%E8%A7%A3%E6%9E%90%E9%85%8D%E7%BD%AE)
    - [作为属性的遗留选项](#%E4%BD%9C%E4%B8%BA%E5%B1%9E%E6%80%A7%E7%9A%84%E9%81%97%E7%95%99%E9%80%89%E9%A1%B9)
    - [TypeScript](#typescript)
    - [createCommand()](#createCommand)
    - [Node 选项，如 --harmony](#node-%E9%80%89%E9%A1%B9%EF%BC%8C%E5%A6%82---harmony)
    - [调试子命令](#%e8%b0%83%e8%af%95%e5%ad%90%e5%91%bd%e4%bb%a4)
    - [显示错误](#%E6%98%BE%E7%A4%BA%E9%94%99%E8%AF%AF)
    - [重写退出和输出](#%E9%87%8D%E5%86%99%E9%80%80%E5%87%BA%E5%92%8C%E8%BE%93%E5%87%BA)
    - [其他文档](#%E5%85%B6%E4%BB%96%E6%96%87%E6%A1%A3)
  - [支持](#%e6%94%af%e6%8c%81)
    - [企业使用 Commander](#%e4%bc%81%e4%b8%9a%e4%bd%bf%e7%94%a8-commander)

关于本文档中使用的术语，请见[术语表](./docs/zh-CN/%E6%9C%AF%E8%AF%AD%E8%A1%A8.md)

## 安装

```sh
npm install commander
```

## 快速开始

编写代码来描述你的命令行界面。
Commander 负责将参数解析为选项和命令参数，为问题显示使用错误，并实现一个有帮助的系统。

Commander 是严格的，并且会针对无法识别的选项显示错误。
两种最常用的选项类型是布尔选项，和从参数中获取值的选项。

示例代码：[split.js](./examples/split.js)

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
$ node split.js -s / --fits a/b/c
error: unknown option '--fits'
(Did you mean --first?)
$ node split.js -s / --first a/b/c
[ 'a' ]
```

这是一个使用子命令并带有帮助描述的更完整的程序。在多命令程序中，每个命令（或命令的独立可执行文件）都有一个操作处理程序。

示例代码：[string-util.js](./examples/string-util.js)

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

$ node string-util.js split --separator=/ a/b/c
[ 'a', 'b', 'c' ]
```

更多示例可以在 [examples](https://github.com/tj/commander.js/tree/master/examples) 目录中找到。

## 声明 program 变量

为简化使用，Commander 提供了一个全局对象。本文档的示例代码均按此方法使用：

```js
// CommonJS (.cjs)
const { program } = require('commander');
```

如果程序较为复杂，用户需要以多种方式来使用 Commander，如单元测试等。创建本地 Command 对象是一种更好的方式：

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

## 选项

Commander 使用`.option()`方法来定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或`|`分隔。

解析后的选项可以通过`Command`对象上的`.opts()`方法获取，同时会被传递给命令处理函数。

对于多个单词的长选项，选项名会转为驼峰命名法（camel-case），例如`--template-engine`选项可通过`program.opts().templateEngine`获取。

选项及其选项参数可以用空格分隔，也可以组合成同一个参数。选项参数可以直接跟在短选项之后，也可以在长选项后面加上 `=`。

```sh
serve -p 80
serve -p80
serve --port 80
serve --port=80
```

`--`可以标记选项的结束，后续的参数均不会被命令解释，可以正常使用。

默认情况下，选项在命令行中的顺序不固定，一个选项可以在其他参数之前或之后指定。

当`.opts()`不够用时，还有其他相关方法：

- `.optsWithGlobals()`返回合并的本地和全局选项值
- `.getOptionValue()`和`.setOptionValue()`操作单个选项的值
- `.getOptionValueSource()`和`.setOptionValueWithSource()`包括选项值的来源

### 常用选项类型，boolean 型选项和带参数选项

有两种最常用的选项，一类是 boolean 型选项，选项无需配置参数，另一类选项则可以设置参数（使用尖括号声明在该选项后，如`--expect <value>`）。如果在命令行中不指定具体的选项及参数，则会被定义为`undefined`。

示例代码：[options-common.js](./examples/options-common.js)

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

多个布尔短选项可以在破折号之后组合在一起，并且可以跟一个取值的单一选项。
例如 `-d -s -p cheese` 可以写成 `-ds -p cheese` 甚至 `-dsp cheese`。

具有预期选项参数的选项是贪婪的，并且无论值如何，都会消耗参数。
所以 `--id -xyz` 读取 `-xyz` 作为选项参数。

通过`program.parse(arguments)`方法处理参数，没有被使用的选项会存放在`program.args`数组中。该方法的参数是可选的，默认值为`process.argv`。

### 选项的默认值

选项可以设置一个默认值。

示例代码：[options-defaults.js](./examples/options-defaults.js)

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

### 其他的选项类型，取反选项，以及可选参数的选项

可以定义一个以`no-`开头的 boolean 型长选项。在命令行中使用该选项时，会将对应选项的值置为`false`。当只定义了带`no-`的选项，未定义对应不带`no-`的选项时，该选项的默认值会被置为`true`。

如果已经定义了`--foo`，那么再定义`--no-foo`并不会改变它本来的默认值。

示例代码：[options-negatable.js](./examples/options-negatable.js)

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

选项的参数使用方括号声明表示参数是可选参数（如`--optional [value]`）。该选项在不带参数时可用作 boolean 选项，在带有参数时则从参数中得到值。

示例代码：[options-boolean-or-value.js](./examples/options-boolean-or-value.js)

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

带有可选选项参数的选项不是贪婪的，并且会忽略以破折号开头的参数。因此对于`--id -5`，`id`表现为布尔选项，但如果需要，您可以使用组合形式，例如 `--id=-5`。

关于可能有歧义的用例，请见[可变参数的选项](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)。

### 必填选项

通过`.requiredOption()`方法可以设置选项为必填。必填选项要么设有默认值，要么必须在命令行中输入，对应的属性字段在解析时必定会有赋值。该方法其余参数与`.option()`一致。

示例代码：[options-required.js](./examples/options-required.js)

```js
program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse();
```

```console
$ pizza
error: required option '-c, --cheese <type>' not specified
```

### 变长参数选项

定义选项时，可以通过使用`...`来设置参数为可变长参数。在命令行中，用户可以输入多个参数，解析后会以数组形式存储在对应属性字段中。在输入下一个选项前（`-`或`--`开头），用户输入的指令均会被视作变长参数。与普通参数一样的是，可以通过`--`标记当前命令的结束。

示例代码：[options-variadic.js](./examples/options-variadic.js)

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

关于可能有歧义的用例，请见[可变参数的选项](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)。

### 版本选项

`.version()`方法可以设置版本，其默认选项为`-V`和`--version`，设置了版本后，命令行会输出当前的版本号。

```js
program.version('0.0.1');
```

```console
$ ./examples/pizza -V
0.0.1
```

版本选项也支持自定义设置选项名称，可以在`.version()`方法里再传递一些参数（长选项名称、描述信息），用法与`.option()`方法类似。

```bash
program.version('0.0.1', '-v, --vers', 'output the current version');
```

### 其他选项配置

大多数情况下，选项均可通过`.option()`方法添加。但对某些不常见的用例，也可以直接构造`Option`对象，对选项进行更详尽的配置。

示例代码：[options-extra.js](./examples/options-extra.js), [options-env.js](./examples/options-env.js), [options-conflicts.js](./examples/options-conflicts.js), [options-implies.js](./examples/options-implies.js)

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

### 自定义选项处理

选项的参数可以通过自定义函数来处理，该函数接收两个参数，即用户新输入的参数值和当前已有的参数值（即上一次调用自定义处理函数后的返回值），返回新的选项参数值。

自定义函数适用场景包括参数类型转换，参数暂存，或者其他自定义处理的场景。

可以在自定义函数的后面设置选项参数的默认值或初始值（例如参数用列表暂存时需要设置一个初始空列表)。

示例代码：[options-custom-processing.js](./examples/options-custom-processing.js)

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

通过`.command()`或`.addCommand()`可以配置命令，有两种实现方式：为命令绑定处理函数，或者将命令单独写成一个可执行文件（详述见后文）。子命令支持嵌套（[示例代码](./examples/nestedCommands.js)）。

`.command()`的第一个参数为命令名称。命令参数可以跟在名称后面，也可以用`.argument()`单独指定。参数可为必选的（尖括号表示）、可选的（方括号表示）或变长参数（点号表示，如果使用，只能是最后一个参数）。

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

使用`.command()`和`addCommand()`来指定选项的相关设置。当设置`hidden: true`时，该命令不会打印在帮助信息里。当设置`isDefault: true`时，若没有指定其他子命令，则会默认执行这个命令（[样例](./examples/defaultCommand.js)）。

### 命令参数

如上所述，子命令的参数可以通过`.command()`指定。对于有独立可执行文件的子命令来说，参数只能以这种方法指定。而对其他子命令，参数也可用以下方法。

在`Command`对象上使用`.argument()`来按次序指定命令参数。该方法接受参数名称和参数描述。参数可为必选的（尖括号表示，例如`<required>`）或可选的（方括号表示，例如`[optional]`）。

示例代码：[argument.js](./examples/argument.js)

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

在参数名后加上`...`来声明可变参数，且只有最后一个参数支持这种用法。可变参数会以数组的形式传递给处理函数。例如：

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

有一种便捷方式可以一次性指定多个参数，但不包含参数描述：

```js
program
  .arguments('<username> <password>');
```

#### 其他参数配置

有少数附加功能可以直接构造`Argument`对象，对参数进行更详尽的配置。

示例代码：[arguments-extra.js](./examples/arguments-extra.js)

```js
program
  .addArgument(new commander.Argument('<drink-size>', 'drink cup size').choices(['small', 'medium', 'large']))
  .addArgument(new commander.Argument('[timeout]', 'timeout in seconds').default(60, 'one minute'))
```

#### 自定义参数处理

选项的参数可以通过自定义函数来处理（与处理选项参数时类似），该函数接收两个参数：用户新输入的参数值和当前已有的参数值（即上一次调用自定义处理函数后的返回值），返回新的命令参数值。

处理后的参数值会传递给命令处理函数，同时可通过`.processedArgs`获取。

可以在自定义函数的后面设置命令参数的默认值或初始值。

示例代码：[arguments-custom-processing.js](./examples/arguments-custom-processing.js)

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

### 处理函数

命令处理函数的参数，为该命令声明的所有参数，除此之外还会附加两个额外参数：一个是解析出的选项，另一个则是该命令对象自身。

示例代码：[thank.js](./examples/thank.js)

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

如果你愿意，你可以跳过为处理函数声明参数直接使用 command。 `this` 关键字设置为运行命令，可以在函数表达式中使用（但不能从箭头函数中使用）。

示例代码：[action-this.js](./examples/action-this.js)

```js
program
  .command('serve')
  .argument('<script>')
  .option('-p, --port <number>', 'port number', 80)
  .action(function() {
    console.error('Run script %s on port %s', this.args[0], this.opts().port);
  });
```

处理函数支持`async`，相应的，需要使用`.parseAsync`代替`.parse`。

```js
async function run() { /* 在这里编写代码 */ }

async function main() {
  program
    .command('run')
    .action(run);
  await program.parseAsync(process.argv);
}
```

使用命令时，所给的选项和命令参数会被验证是否有效。凡是有未知的选项，或缺少所需的命令参数，都会报错。
如要允许使用未知的选项，可以调用`.allowUnknownOption()`。默认情况下，传入过多的参数并不报错，但也可以通过调用`.allowExcessArguments(false)`来启用过多参数的报错。

### 独立的可执行（子）命令

当`.command()`带有描述参数时，就意味着使用独立的可执行文件作为子命令。
Commander 会尝试在入口脚本的目录中搜索名称组合为 `command-subcommand` 的文件，如以下示例中的 `pm-install` 或 `pm-search`。搜索包括尝试常见的文件扩展名，如`.js`。
你可以使用 `executableFile` 配置选项指定自定义名称（和路径）。
你可以使用 `.executableDir()` 为子命令指定自定义搜索目录。

你可以在可执行文件里处理（子）命令的选项，而不必在顶层声明它们。

示例代码：[pm](./examples/pm)

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

如果该命令需要支持全局安装，请确保有对应的权限，例如`755`。

### 生命周期钩子

可以在命令的生命周期事件上设置回调函数。

示例代码：[hook.js](./examples/hook.js)

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

钩子函数支持`async`，相应的，需要使用`.parseAsync`代替`.parse`。一个事件上可以添加多个钩子。

支持的事件有：

| 事件名称 | 触发时机 | 参数列表 |
| :-- | :-- | :-- |
| `preAction`, `postAction` | 本命令或其子命令的处理函数执行前/后 |   `(thisCommand, actionCommand)` |
| `preSubcommand` | 在其直接子命令解析之前调用  | `(thisCommand, subcommand)` |

## 自动化帮助信息

帮助信息是 Commander 基于你的程序自动生成的，默认的帮助选项是`-h,--help`。

示例代码：[pizza](./examples/pizza)

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

如果你的命令中包含了子命令，会默认添加`help`命令，它可以单独使用，也可以与子命令一起使用来提示更多帮助信息。用法与`shell`程序类似：

```sh
shell help
shell --help

shell help spawn
shell spawn --help
```

### 自定义帮助

可以添加额外的帮助信息，与内建的帮助一同展示。

示例代码：[custom-help](./examples/custom-help)

```js
program
  .option('-f, --foo', 'enable some foo');

program.addHelpText('after', `

Example call:
  $ custom-help --help`);
```

将会输出以下的帮助信息：

```Text
Usage: custom-help [options]

Options:
  -f, --foo   enable some foo
  -h, --help  display help for command

Example call:
  $ custom-help --help
```

位置参数对应的展示方式如下：

- `beforeAll`：作为全局标头栏展示
- `before`：在内建帮助信息之前展示
- `after`：在内建帮助信息之后展示
- `afterAll`：作为全局末尾栏展示

`beforeAll`和`afterAll`两个参数作用于命令及其所有的子命令。

第二个参数可以是一个字符串，也可以是一个返回字符串的函数。对后者而言，为便于使用，该函数可以接受一个上下文对象，它有如下属性：

- `error`：boolean 值，代表该帮助信息是否由于不当使用而展示
- `command`：代表展示该帮助信息的`Command`对象

### 在出错后展示帮助信息

默认情况下，出现命令用法错误时只会显示错误信息。可以选择在出错后展示完整的帮助或自定义的帮助信息。

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

默认行为是在出现未知命令或选项错误后建议正确拼写。你可以禁用此功能。

```js
program.showSuggestionAfterError(false);
```

```console
$ pizza --hepl
error: unknown option '--hepl'
(Did you mean --help?)
```

### 使用代码展示帮助信息

`.help()`：展示帮助信息并退出。可以通过传入`{ error: true }`来让帮助信息从 stderr 输出，并以代表错误的状态码退出程序。

`.outputHelp()`：只展示帮助信息，不退出程序。传入`{ error: true }`可以让帮助信息从 stderr 输出。

`.helpInformation()`：得到字符串形式的内建的帮助信息，以便用于自定义的处理及展示。

### .name

命令名称出现在帮助中，也用于定位独立的可执行子命令。

你可以使用 `.name()` 或在 Command 构造函数中指定程序名称。对于 program ，Commander 会使用传递给 `.parse()` 的完整参数中的脚本名称。但是，脚本名称会根据程序的启动方式而有所不同，因此您可能希望明确指定它。

```js
program.name('pizza');
const pm = new Command('pm');
```

使用 `.command()` 指定时，子命令会获得名称。如果您自己创建子命令以与 `.addCommand()` 一起使用，则使用 `.name()` 或在 Command 构造函数中设置名称。

### .usage

通过这个选项可以修改帮助信息的首行提示，例如：

```js
program
  .name("my-command")
  .usage("[global options] command")
```

帮助信息开头如下：

```Text
Usage: my-command [global options] command
```

### .description 和 .summary

description 出现在命令的帮助中。当列为程序的子命令时，你可以选择提供更短的 summary 以供使用。

```js
program
  .command("duplicate")
  .summary("make a copy")
  .description(`Make a copy of the current project.
This may require additional disk space.
  `);
```

### .helpOption(flags, description)

每一个命令都带有一个默认的帮助选项。你可以改变 `flags` 和 `description` 参数。传入 `false` 则会禁用内建的帮助信息。

```js
program
  .helpOption('-e, --HELP', 'read more information');
```

### .addHelpCommand()

如果一个命令拥有子命令，它也将有一个默认的帮助子命令。使用`.addHelpCommand()`和`.addHelpCommand(false)`可以打开或关闭默认的帮助子命令。

也可以自定义名字和描述：

```js
program.addHelpCommand('assist [command]', 'show assistance');
```

### 其他帮助配置

内建帮助信息通过`Help`类进行格式化。如有需要，可以使用`.configureHelp()`来更改其数据属性和方法，或使用`.createHelp()`来创建子类，从而配置`Help`类的行为。

数据属性包括：

- `helpWidth`：指明帮助信息的宽度。可在单元测试中使用。
- `sortSubcommands`：以字母序排列子命令
- `sortOptions`：以字母序排列选项

可以得到可视化的参数列表，选项列表，以及子命令列表。列表的每个元素都具有`_term_`和`_description_`属性，并可以对其进行格式化。关于其使用方式，请参考`.formatHelp()`。

示例代码：[configure-help.js](./examples/configure-help.js)

```js
program.configureHelp({
  sortSubcommands: true,
  subcommandTerm: (cmd) => cmd.name() // 显示名称，而非用法
});
```

## 自定义事件监听

监听命令和选项可以执行自定义函数。

```js
program.on('option:verbose', function () {
  process.env.VERBOSE = this.opts().verbose;
});
```

## 零碎知识

### .parse() 和 .parseAsync()

`.parse`的第一个参数是要解析的字符串数组，也可以省略参数而使用`process.argv`。

如果参数遵循与 node 不同的约定，可以在第二个参数中传递`from`选项：

- `node`：默认值，`argv[0]`是应用，`argv[1]`是要跑的脚本，后续为用户参数；
- `electron`：`argv[1]`根据 electron 应用是否打包而变化；
- `user`：来自用户的所有参数。

例如：

```js
program.parse(process.argv); // 指明，按 node 约定
program.parse(); // 默认，自动识别 electron
program.parse(['-f', 'filename'], { from: 'user' });
```

### 解析配置

当默认的解析方式无法满足需要，Commander 也提供了其他的解析行为。

默认情况下，程序的选项在子命令前后均可被识别。如要只允许选项出现在子命令之前，可以使用`.enablePositionalOptions()`。这样可以在命令和子命令中使用意义不同的同名选项。

示例代码：[positional-options.js](./examples/positional-options.js)

当启用了带顺序的选项解析，以下程序中，`-b`选项在第一行中将被解析为程序顶层的选项，而在第二行中则被解析为子命令的选项：

```sh
program -b subcommand
program subcommand -b
```

默认情况下，选项在命令参数前后均可被识别。如要使选项仅在命令参数前被识别，可以使用`.passThroughOptions()`。这样可以把参数和跟随的选项传递给另一程序，而无需使用`--`来终止选项解析。
如要在子命令中使用此功能，必须首先启用带顺序的选项解析。

示例代码：[pass-through-options.js](./examples/pass-through-options.js)

当启用此功能时，以下程序中，`--port=80`在第一行中会被解析为程序的选项，而在第二行中则会被解析为一个命令参数：

```sh
program --port=80 arg
program arg --port=80
```

默认情况下，使用未知选项会提示错误。如要将未知选项视作普通命令参数，并继续处理其他部分，可以使用`.allowUnknownOption()`。这样可以混用已知和未知的选项。

默认情况下，传入过多的命令参数并不会报错。可以使用`.allowExcessArguments(false)`来启用这一检查。

### 作为属性的遗留选项

在 Commander 7 以前，选项的值是作为属性存储在命令对象上的。
这种处理方式便于实现，但缺点在于，选项可能会与`Command`的已有属性相冲突。通过使用`.storeOptionsAsProperties()`，可以恢复到这种旧的处理方式，并可以不加改动地继续运行遗留代码。

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

如果你使用 ts-node，并有`.ts`文件作为独立可执行文件，那么需要用 node 运行你的程序以使子命令能正确调用，例如：

```sh
node -r ts-node/register pm.ts
```

### createCommand()

使用这个工厂方法可以创建新命令，此时不需要使用`new`，如

```bash
const { createCommand } = require('commander');
const program = createCommand();
```

`createCommand`同时也是`Command`对象的一个方法，可以创建一个新的命令（而非子命令），使用`.command()`创建子命令时内部会调用该方法，具体使用方式可参考 [custom-command-class.js](./examples/custom-command-class.js)。

### Node 选项，如 --harmony

要使用`--harmony`等选项有以下两种方式：

- 在子命令脚本中加上`#!/usr/bin/env node --harmony`。注：Windows 系统不支持；
- 调用时加上`--harmony`参数，例如`node --harmony examples/pm publish`。`--harmony`选项在开启子进程时仍会保留。

### 调试子命令

一个可执行的子命令会作为单独的子进程执行。

如果使用 node inspector 的`node -inspect`等命令来[调试](https://nodejs.org/en/docs/guides/debugging-getting-started/)可执行命令，对于生成的子命令，inspector 端口会递增 1。

如果想使用 VSCode 调试，则需要在`launch.json`配置文件里设置`"autoAttachChildProcesses": true`。

### 显示错误

你可用于针对自己的错误情况调用 Commander 错误处理。（另请参阅下一节有关退出处理的内容）

除了错误消息，你还可以选择指定 `exitCode`（与 `process.exit` 一起使用）和 `code`（与 `CommanderError` 一起使用）

```js
program.error('Password must be longer than four characters');
program.error('Custom processing has failed', { exitCode: 2, code: 'my.custom.error' });
```

### 重写退出和输出

默认情况下，在检测到错误、打印帮助信息或版本信息时 Commander 会调用`process.exit`方法。其默认实现会抛出一个`CommanderError`，可以重写该方法并提供一个回调函数（可选）。

回调函数的参数为`CommanderError`，属性包括 Number 型的`exitCode`、String 型的`code`和`message`。子命令完成调用后会开始异步处理。正常情况下，打印错误信息、帮助信息或版本信息不会被重写影响，因为重写会发生在打印之后。

```js
program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  // 自定义处理...
}
```

Commander 默认用作命令行应用，其输出写入 stdout 和 stderr。
对于其他应用类型，这一行为可以修改。并且可以修改错误信息的展示方式。

示例代码：[configure-output.js](./examples/configure-output.js)

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

### 其他文档

请参考关于如下话题的其他文档：

- [不再推荐使用的功能](./docs/zh-CN/%E4%B8%8D%E5%86%8D%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%E7%9A%84%E5%8A%9F%E8%83%BD.md)。这些功能仍受到支持，以保证向后兼容。
- [可变参数的选项](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)

## 支持

当前版本的 Commander 在 LTS 版本的 Node.js 上完全支持。并且至少需要 v18。
（使用更低版本 Node.js 的用户建议安装更低版本的 Commander）

社区支持请访问项目的 [Issues](https://github.com/tj/commander.js/issues)。

### 企业使用 Commander

作为 Tidelift 订阅的一部分。

Commander 和很多其他包的维护者已与 Tidelift 合作，面向企业提供开源依赖的商业支持与维护。企业可以向相关依赖包的维护者支付一定的费用，帮助企业节省时间，降低风险，改进代码运行情况。[了解更多](https://tidelift.com/subscription/pkg/npm-commander?utm_source=npm-commander&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)
