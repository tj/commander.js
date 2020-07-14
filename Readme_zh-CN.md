# Commander.js

[![Build Status](https://api.travis-ci.org/tj/commander.js.svg?branch=master)](http://travis-ci.org/tj/commander.js)
[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

完整的 [node.js](http://nodejs.org) 命令行解决方案，灵感来自 Ruby 的 [commander](https://github.com/commander-rb/commander)。

使用其他语言阅读：[English](./Readme.md) | 简体中文

- [Commander.js](#commanderjs)
  - [安装](#%e5%ae%89%e8%a3%85)
  - [声明 program 变量](#%e5%a3%b0%e6%98%8e-program-%e5%8f%98%e9%87%8f)
  - [选项](#%e9%80%89%e9%a1%b9)
    - [常用选项类型，boolean 型选项和带参数的选项](#%e5%b8%b8%e7%94%a8%e9%80%89%e9%a1%b9%e7%b1%bb%e5%9e%8bboolean-%e5%9e%8b%e9%80%89%e9%a1%b9%e5%92%8c%e5%b8%a6%e5%8f%82%e6%95%b0%e9%80%89%e9%a1%b9)
    - [选项的默认值](#%e9%80%89%e9%a1%b9%e7%9a%84%e9%bb%98%e8%ae%a4%e5%80%bc)
    - [其他选项类型，取反选项](#%e5%85%b6%e4%bb%96%e7%9a%84%e9%80%89%e9%a1%b9%e7%b1%bb%e5%9e%8b%e5%8f%96%e5%8f%8d%e9%80%89%e9%a1%b9)
    - [自定义选项处理](#%e8%87%aa%e5%ae%9a%e4%b9%89%e9%80%89%e9%a1%b9%e5%a4%84%e7%90%86)
    - [必填选项](#%e5%bf%85%e5%a1%ab%e9%80%89%e9%a1%b9)
    - [变长参数选项](#%e5%8f%98%e9%95%bf%e5%8f%82%e6%95%b0%e9%80%89%e9%a1%b9)
    - [版本选项](#%e7%89%88%e6%9c%ac%e9%80%89%e9%a1%b9)
  - [命令](#%e5%91%bd%e4%bb%a4)
    - [设置参数](#%e8%ae%be%e7%bd%ae%e5%8f%82%e6%95%b0)
    - [（子）命令处理函数](#%e5%ad%90%e5%91%bd%e4%bb%a4%e5%a4%84%e7%90%86%e5%87%bd%e6%95%b0)
    - [独立的可执行（子）命令](#%e7%8b%ac%e7%ab%8b%e7%9a%84%e5%8f%af%e6%89%a7%e8%a1%8c%e5%ad%90%e5%91%bd%e4%bb%a4)
  - [自动化帮助信息](#%e8%87%aa%e5%8a%a8%e5%8c%96%e5%b8%ae%e5%8a%a9%e4%bf%a1%e6%81%af)
    - [自定义帮助](#%e8%87%aa%e5%ae%9a%e4%b9%89%e5%b8%ae%e5%8a%a9)
    - [.usage 和 .name](#usage-%e5%92%8c-name)
    - [.help(cb)](#helpcb)
    - [.outputHelp(cb)](#outputhelpcb)
    - [.helpInformation()](#helpinformation)
    - [.helpOption(flags, description)](#helpoptionflags-description)
    - [.addHelpCommand()](#addhelpcommand)
  - [自定义事件监听](#%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6%e7%9b%91%e5%90%ac)
  - [零碎知识](#%e9%9b%b6%e7%a2%8e%e7%9f%a5%e8%af%86)
    - [.parse() 和 .parseAsync()](#parse-%e5%92%8c-parseasync)
    - [避免选项命名冲突](#%e9%81%bf%e5%85%8d%e9%80%89%e9%a1%b9%e5%91%bd%e5%90%8d%e5%86%b2%e7%aa%81)
    - [TypeScript](#typescript)
    - [createCommand()](#createCommand)
    - [导入到 ES 模块](#%e5%af%bc%e5%85%a5%e5%88%b0+ES+%e6%a8%a1%e5%9d%97)
    - [Node 选项 --harmony](#node-%e9%80%89%e9%a1%b9---harmony)
    - [调试子命令](#%e8%b0%83%e8%af%95%e5%ad%90%e5%91%bd%e4%bb%a4)
    - [重写退出](#%e9%87%8d%e5%86%99%e9%80%80%e5%87%ba)
  - [例子](#%e4%be%8b%e5%ad%90)
  - [支持](#%e6%94%af%e6%8c%81)
    - [企业使用 Commander](#%e4%bc%81%e4%b8%9a%e4%bd%bf%e7%94%a8-commander)

## 安装

```bash
npm install commander
```

## 声明 program 变量

为简化使用，Commander 提供了一个全局对象。本文档的示例代码均按此方法使用：

```js
const { program } = require('commander');
program.version('0.0.1');
```

如果程序较为复杂，用户需要以多种方式来使用 Commander，如单元测试等。创建本地 Command 对象是一种更好的方式：

```js
const { Command } = require('commander');
const program = new Command();
program.version('0.0.1');
```

## 选项

Commander 使用`.option()` 方法来定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或`|`分隔。

选项可以通过 Commander 对象的同名属性获取，对于多个单词的长选项，使用驼峰法获取，例如`--template-engine`与属性`program.templateEngine`关联。选项命名可参考[避免选项命名冲突](#%e9%81%bf%e5%85%8d%e9%80%89%e9%a1%b9%e5%91%bd%e5%90%8d%e5%86%b2%e7%aa%81)。

多个短选项可以合并简写，其中最后一个选项可以附加参数。
例如，`-a -b -p 80` 也可以写为 `-ab -p80` ，甚至进一步简化为 `-abp80`。

`--`可以标记选项的结束，后续的参数均不会被命令解释，可以正常使用。
如果后续命令也需要设置选项，则可以通过该方式实现，例如:`do -- git --version`。

选项在命令行中的顺序不固定，一个选项可以在其他选项之前或之后指定。

### 常用选项类型，boolean 型选项和带参数选项

有两种最常用的选项，一类是 boolean 型选项，选项无需配置参数，另一类选项则可以设置参数（使用尖括号声明）。如果在命令行中不指定具体的选项及参数，则会被定义为`undefined`。

示例代码：[options-common.js](./examples/options-common.js)

 ```js
program
  .option('-d, --debug', 'output extra debugging')
  .option('-s, --small', 'small pizza size')
  .option('-p, --pizza-type <type>', 'flavour of pizza');

program.parse(process.argv);

if (program.debug) console.log(program.opts());
console.log('pizza details:');
if (program.small) console.log('- small pizza size');
if (program.pizzaType) console.log(`- ${program.pizzaType}`);
 ```

```bash
$ pizza-options -d
{ debug: true, small: undefined, pizzaType: undefined }
pizza details:
$ pizza-options -p
error: option '-p, --pizza-type <type>' argument missing
$ pizza-options -ds -p vegetarian
{ debug: true, small: true, pizzaType: 'vegetarian' }
pizza details:
- small pizza size
- vegetarian
$ pizza-options --pizza-type=cheese
pizza details:
- cheese
```

通过`program.parse(arguments)`方法处理参数，没有被使用的选项会存放在`program.args`数组中。

### 选项的默认值

选项可以设置一个默认值。

示例代码：[options-defaults.js](./examples/options-defaults.js)

```js
program
  .option('-c, --cheese <type>', 'add the specified type of cheese', 'blue');

program.parse(process.argv);

console.log(`cheese: ${program.cheese}`);
```

```bash
$ pizza-options
cheese: blue
$ pizza-options --cheese stilton
cheese: stilton
```

### 其他的选项类型，取反选项

当选项为`boolean`类型时，在选项长名字前加`no-`可以配置这个选项（带 no-）的默认值为`false`，原选项（不带no-）默认为`true`，需要注意的是，仅有单独定义这种形式的选项才能有这种效果。

如果先定义了`--foo`，那么`--no-foo`并不会改变它本来的默认值。可以为一个`boolean`类型的选项指定一个默认的布尔值，在命令行里可以重写它的值。

示例代码：[options-negatable.js](./examples/options-negatable.js)

```js
program
  .option('--no-sauce', 'Remove sauce')
  .option('--cheese <flavour>', 'cheese flavour', 'mozzarella')
  .option('--no-cheese', 'plain with no cheese')
  .parse(process.argv);

const sauceStr = program.sauce ? 'sauce' : 'no sauce';
const cheeseStr = (program.cheese === false) ? 'no cheese' : `${program.cheese} cheese`;
console.log(`You ordered a pizza with ${sauceStr} and ${cheeseStr}`);
```

```bash
$ pizza-options
You ordered a pizza with sauce and mozzarella cheese
$ pizza-options --sauce
error: unknown option '--sauce'
$ pizza-options --cheese=blue
You ordered a pizza with sauce and blue cheese
$ pizza-options --no-sauce --no-cheese
You ordered a pizza with no sauce and no cheese
```

选项的参数使用方括号声明表示参数是可选参数，即传值不是必须的。

示例代码：[options-flag-or-value.js](./examples/options-flag-or-value.js)

```js
program
  .option('-c, --cheese [type]', 'Add cheese with optional type');

program.parse(process.argv);

if (program.cheese === undefined) console.log('no cheese');
else if (program.cheese === true) console.log('add cheese');
else console.log(`add cheese type ${program.cheese}`);
```

```bash
$ pizza-options
no cheese
$ pizza-options --cheese
add cheese
$ pizza-options --cheese mozzarella
add cheese type mozzarella
```

### 自定义选项处理

选项的参数可以通过自定义函数来处理，该函数接收两个参数：用户新输入的参数和当前已有的参数（即上一次调用自定义处理函数后的返回值），返回新的选项参数。

自定义函数适用场景包括参数类型转换，参数暂存，或者其他自定义处理的场景。

自定义函数可以设置选项参数的默认值或初始值（例如参数用`list`暂存时需要设置一个初始空集合)。

示例代码：[options-custom-processing.js](./examples/options-custom-processing.js)

```js
function myParseInt(value, dummyPrevious) {
  // parseInt takes a string and an optional radix
  return parseInt(value);
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

program.parse(process.argv);

if (program.float !== undefined) console.log(`float: ${program.float}`);
if (program.integer !== undefined) console.log(`integer: ${program.integer}`);
if (program.verbose > 0) console.log(`verbosity: ${program.verbose}`);
if (program.collect.length > 0) console.log(program.collect);
if (program.list !== undefined) console.log(program.list);
```

```bash
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

### 必填选项

通过`.requiredOption`方法可以设置选项为必填。必填选项要么设有默认值，要么必须在命令行中输入，对应的属性字段在解析时必定会有赋值。该方法其余参数与`.option`一致。

示例代码：[options-required.js](./examples/options-required.js)

```js
program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse(process.argv);
```

```bash
$ pizza
error: required option '-c, --cheese <type>' not specified
```

### 变长参数选项

定义选项时，可以通过使用`...`来设置参数为可变长参数。在命令行中，用户可以输入多个参数，解析后会以数组形式存储在对应属性字段中。在输入下一个选项前（-或--开头），用户输入的指令均会被视作变长参数。与普通参数一样的是，可以通过`--`标记当前命令的结束。

示例代码：[options-variadic.js](./examples/options-variadic.js)

```js
program
  .option('-n, --number <numbers...>', 'specify numbers')
  .option('-l, --letter [letters...]', 'specify letters');

program.parse();

console.log('Options: ', program.opts());
console.log('Remaining arguments: ', program.args);
```

```bash
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

### 版本选项

`version`方法可以设置版本，其默认选项为`-V`和`--version`，设置了版本后，命令行会输出当前的版本号。

```js
program.version('0.0.1');
```

```bash
$ ./examples/pizza -V
0.0.1
```

版本选项也支持自定义设置选项名称，可以在`version`方法里再传递一些参数（长选项名称，描述信息），用法与`option`方法类似。

```bash
program.version('0.0.1', '-v, --vers', 'output the current version');
```

## 命令

通过`.command()`或`.addCommand()`可以配置命令，有两种实现方式：为命令绑定处理函数，或者将命令单独写成一个可执行文件（详述见后文）。子命令支持嵌套（[示例代码](./examples/nestedCommands.js)）。

`.command()`的第一个参数可以配置命令名称及参数，参数支持必选（尖括号表示）、可选（方括号表示）及变长参数（点号表示，如果使用，只能是最后一个参数）。

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

使用`.command()`和`addCommand()`来传递配置的选项。当`opts.noHelp`设置为`true`时，该命令不会打印在帮助信息里。当`opts.isDefault`设置为`true`时，若没有指定其他子命令，则会默认执行这个命令（[样例](./examples/defaultCommand.js)）。

### 设置参数

通过`.arguments`可以为最顶层命令指定参数，对子命令而言，参数都包括在`.command`调用之中了。尖括号（例如`<required>`）意味着必选，而方括号（例如`[optional]`）则代表可选。

示例代码：[env](./examples/env)

```js
program
  .version('0.1.0')
  .arguments('<cmd> [env]')
  .action(function (cmd, env) {
    cmdValue = cmd;
    envValue = env;
  });

program.parse(process.argv);

if (typeof cmdValue === 'undefined') {
  console.error('no command given!');
  process.exit(1);
}
console.log('command:', cmdValue);
console.log('environment:', envValue || "no environment given");
```

在参数名后加上`...`来声明可变参数，且只有最后一个参数支持这种用法，例如

```js
const program = require('commander');

program
  .version('0.1.0')
  .command('rmdir <dir> [otherDirs...]')
  .action(function (dir, otherDirs) {
    console.log('rmdir %s', dir);
    if (otherDirs) {
      otherDirs.forEach(function (oDir) {
        console.log('rmdir %s', oDir);
      });
    }
  });

program.parse(process.argv);
```

可变参数会以数组的形式传递给处理函数。

### （子）命令处理函数

设置处理函数的命令可以配置选项。
命令处理函数的参数为该命令声明的所有参数，除此之外还会附加一个额外参数：该命令对象自身，配置的选项会绑定到这个对象的同名属性上。

```js
const program = require('commander');

program
  .command('rm <dir>')
  .option('-r, --recursive', 'Remove recursively')
  .action(function (dir, cmdObj) {
    console.log('remove ' + dir + (cmdObj.recursive ? ' recursively' : ''))
  })

program.parse(process.argv)
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


在命令行上使用命令时，选项必须是合法的，使用任何未知的选项会提示异常。

### 独立的可执行（子）命令

当`.command()`带有描述参数时，就意味着使用独立的可执行文件作为子命令。
Commander 将会尝试在入口脚本（例如 `./examples/pm`）的目录中搜索`program-command`形式的可执行文件，例如`pm-install`, `pm-search`。通过配置选项`executableFile`可以自定义名字。

你可以在可执行文件里处理（子）命令的选项，而不必在顶层声明它们。

示例代码：[pm](./examples/pm)

```js
program
  .version('0.1.0')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('update', 'update installed packages', { executableFile: 'myUpdateSubCommand' })
  .command('list', 'list packages installed', { isDefault: true });

program.parse(process.argv);
```

如果该命令需要支持全局安装，请确保有对应的权限，例如`755`。

## 自动化帮助信息

帮助信息是 Commander 基于你的程序自动生成的，默认的帮助选项是`-h,--help`。

示例代码：[pizza](./examples/pizza)

```bash
$ node ./examples/pizza --help
Usage: pizza [options]

An application for pizzas ordering

Options:
  -V, --version        output the version number
  -p, --peppers        Add peppers
  -c, --cheese <type>  Add the specified type of cheese (default: "marble")
  -C, --no-cheese      You do not want any cheese
  -h, --help           display help for command
```

如果你的命令中包含了子命令，会默认添加`help`命令，它可以单独使用，也可以与子命令一起使用来提示更多帮助信息。用法与`shell`程序类似:

```bash
shell help
shell --help

shell help spawn
shell spawn --help
```

### 自定义帮助

通过监听`--help`可以自定义帮助信息。

```js
program
  .option('-f, --foo', 'enable some foo');

// 必须在调用 .parse() 之前
program.on('--help', () => {
  console.log('');
  console.log('Example call:');
  console.log('  $ custom-help --help');
});
```

将会输出以下的帮助信息

```Text
Usage: custom-help [options]

Options:
  -f, --foo   enable some foo
  -h, --help  display help for command

Example call:
  $ custom-help --help
```

### .usage 和 .name

通过这两个选项可以修改帮助信息的首行提示，name 属性也可以从参数中推导出来。例如：

```js
program
  .name("my-command")
  .usage("[global options] command")
```

帮助信息会首先输出：

```Text
Usage: my-command [global options] command
```

### .help(cb)

打印帮助信息并立即退出，回调函数`cb`（可选）可在打印帮助信息前对帮助信息进行处理。

### .outputHelp(cb)

打印帮助信息的同时不退出，回调函数`cb`（可选）可在打印帮助信息前对帮助信息进行处理。

### .helpInformation()

该方法可以获取到帮助信息，注意：该方法的返回值不包括使用`--help`监听器设置的帮助信息。

### .helpOption(flags, description)

自定义帮助选项和描述。

```js
program
  .helpOption('-e, --HELP', 'read more information');
```

### .addHelpCommand()

使用`.addHelpCommand()`和`.addHelpCommand(false)`可以打开或关闭默认的帮助命令。

也可以自定义名字和描述：

```js
program.addHelpCommand('assist [command]', 'show assistance');
```

## 自定义事件监听

监听命令和选项可以执行自定义函数。

```js
program.on('option:verbose', function () {
  process.env.VERBOSE = this.verbose;
});

program.on('command:*', function (operands) {
  console.error(`error: unknown command '${operands[0]}'`);
  const availableCommands = program.commands.map(cmd => cmd.name());
  mySuggestBestMatch(operands[0], availableCommands);
  process.exitCode = 1;
});
```

## 零碎知识

### .parse() 和 .parseAsync()

`.parse`的第一个参数是要解析的字符串数组，也可以省略参数而使用`process.argv`。

如果参数遵循与 node 不同的约定，可以在第二个参数中传递`from`选项：

- 'node': 默认值，`argv[0]`是应用，`argv[1]`是要跑的脚本，后续为用户参数；
- 'electron': `argv[1]`根据 electron 应用是否打包而变化；
- 'user': 来自用户的所有参数。

比如:

```js
program.parse(process.argv); // node
program.parse();
program.parse(['-f', 'filename'], { from: 'user' });
```

### 避免选项命名冲突

Commander 默认将选项存储在 `program `的对应的同名属性上，自定义处理函数也支持传递一个将选项值作为属性存储的 command 对象。这样的方式带来了极大的方便，但可能会导致与 Command 对象的属性冲突。

有两种方法可以修改这种方式，并且在未来我们有可能会调整这个默认的方式：

- `storeOptionsAsProperties`: 是否将选项值作为 command 对象的属性来存储，或分别存储（设为`false`）并使用`.opts()`来获取；
- `passCommandToAction`: 是否把 command 对象传递给操作处理程序，或仅仅传递这些选项（设为`false`）。

示例代码：[storeOptionsAsProperties-action.js](./examples/storeOptionsAsProperties-action.js)

```js
program
  .storeOptionsAsProperties(false)
  .passCommandToAction(false);

program
  .name('my-program-name')
  .option('-n,--name <name>');

program
  .command('show')
  .option('-a,--action <action>')
  .action((options) => {
    console.log(options.action);
  });

program.parse(process.argv);

const programOptions = program.opts();
console.log(programOptions.name);
```

### TypeScript

Commander 包里包含了 TypeScript 定义文件。

如果使用`.ts`格式编写命令，则需要通过 node 来执行命令。如：

```bash
node -r ts-node/register pm.ts
```

### createCommand()

使用工厂方法可以创建一个`command`，此时不需要使用`new`方法，如

```bash
const { createCommand } = require('commander');
const program = createCommand();
```

`createCommand`是 command 对象的一个方法，可以创建一个新的命令（而非子命令），使用`command()`创建子命令时内部会调用该方法，具体使用方式可参考[子类](./examples/custom-command-class.js)和[方法重写](./examples/custom-command-function.js)。

### 导入到 ES 模块

Commander 是一个 CommonJS 包，支持导入到 ES 模块中去。

```js
// index.mjs
import commander from 'commander';
const program = commander.program;
const newCommand = new commander.Command();
```

### Node 选项 --harmony

启用`--harmony`有以下两种方式：

- 在子命令脚本中加上`#!/usr/bin/env node --harmony`。注：Windows 系统不支持；
- 调用时加上`--harmony`参数，例如`node --harmony examples/pm publish`。`--harmony`选项在开启子进程时仍会保留。

### 调试子命令

一个可执行的子命令会作为单独的子进程执行。

如果使用 node inspector 的`node -inspect`等命令来[调试](https://nodejs.org/en/docs/guides/debugging-getting-started/)可执行命令，对于生成的子命令，inspector 端口会递增1。

如果想使用 VSCode 调试，则需要在`launch.json`配置文件里设置`"autoAttachChildProcesses": true`。

### 重写退出

默认情况下，在检测到错误、打印帮助信息或版本信息时 Commander 会调用`process.exit`方法。其默认实现会抛出一个`CommanderError`，可以重写该方法并提供一个回调函数（可选）。

回调函数的参数为`CommanderError`，属性包括 Number 型的`exitCode`、String 型的`code`和`message`。子命令完成调用后会开始异步处理。正常情况下，打印错误信息、帮助信息或版本信息不会被重写影响，因为重写会发生在打印之后。

``` js
program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  // 自定义处理...
}
```

## 例子

示例代码：[deploy](./examples/deploy)

```js
const program = require('commander');

program
  .version('0.1.0')
  .option('-C, --chdir <path>', 'change the working directory')
  .option('-c, --config <path>', 'set config path. defaults to ./deploy.conf')
  .option('-T, --no-tests', 'ignore test hook');

program
  .command('setup [env]')
  .description('run setup commands for all envs')
  .option("-s, --setup_mode [mode]", "Which setup mode to use")
  .action(function(env, options){
    const mode = options.setup_mode || "normal";
    env = env || 'all';
    console.log('setup for %s env(s) with %s mode', env, mode);
  });

program
  .command('exec <cmd>')
  .alias('ex')
  .description('execute the given remote cmd')
  .option("-e, --exec_mode <mode>", "Which exec mode to use")
  .action(function(cmd, options){
    console.log('exec "%s" using %s mode', cmd, options.exec_mode);
  }).on('--help', function() {
    console.log('');
    console.log('Examples:');
    console.log('');
    console.log('  $ deploy exec sequential');
    console.log('  $ deploy exec async');
  });

program.parse(process.argv);
```

更多的示例代码点击[这里](https://github.com/tj/commander.js/tree/master/examples)查看。

## 支持

Commander 5.x 能运行在 Node 的 LTS 版本上，可能也适用于 Node 6，但并未进行严格测试。（低于 Node 6 的用户建议使用 Commander 3.x 或 2.x 版本。）

社区支持请访问项目的 [Issues](https://github.com/tj/commander.js/issues)。

### 企业使用 Commander

现在 Commander 已作为 Tidelift 订阅的一部分。

Commander 和很多其他包的维护者已与 Tidelift 合作，面向企业提供开源依赖的商业支持与维护。企业可以向相关依赖包的维护者支付一定的费用，帮助企业节省时间，降低风险，改进代码运行情况。[了解更多](https://tidelift.com/subscription/pkg/npm-commander?utm_source=npm-commander&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)