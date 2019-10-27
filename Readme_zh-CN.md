# Commander.js

[![Build Status](https://api.travis-ci.org/tj/commander.js.svg?branch=master)](http://travis-ci.org/tj/commander.js)
[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

[node.js](http://nodejs.org) 命令行接口的完整解决方案，灵感来自 Ruby 的 [commander](https://github.com/commander-rb/commander)。

- [Commander.js](#commanderjs)
  - [安装](#%e5%ae%89%e8%a3%85)
  - [声明program变量](#%e5%a3%b0%e6%98%8eprogram%e5%8f%98%e9%87%8f)
  - [选项](#%e9%80%89%e9%a1%b9)
    - [常用选项类型，boolean和值](#%e5%b8%b8%e7%94%a8%e9%80%89%e9%a1%b9%e7%b1%bb%e5%9e%8bboolean%e5%92%8c%e5%80%bc)
    - [默认选项值](#%e9%bb%98%e8%ae%a4%e9%80%89%e9%a1%b9%e5%80%bc)
    - [其他选项类型，可忽略的布尔值和标志值](#%e5%85%b6%e4%bb%96%e9%80%89%e9%a1%b9%e7%b1%bb%e5%9e%8b%e5%8f%af%e5%bf%bd%e7%95%a5%e7%9a%84%e5%b8%83%e5%b0%94%e5%80%bc%e5%92%8c%e6%a0%87%e5%bf%97%e5%80%bc)
    - [自定义选项处理](#%e8%87%aa%e5%ae%9a%e4%b9%89%e9%80%89%e9%a1%b9%e5%a4%84%e7%90%86)
    - [版本选项](#%e7%89%88%e6%9c%ac%e9%80%89%e9%a1%b9)
  - [Commands](#commands)
    - [指定参数语法](#%e6%8c%87%e5%ae%9a%e5%8f%82%e6%95%b0%e8%af%ad%e6%b3%95)
    - [操作处理程序(Action handler) (子)命令](#%e6%93%8d%e4%bd%9c%e5%a4%84%e7%90%86%e7%a8%8b%e5%ba%8faction-handler-%e5%ad%90%e5%91%bd%e4%bb%a4)
    - [Git 风格的子命令](#git-%e9%a3%8e%e6%a0%bc%e7%9a%84%e5%ad%90%e5%91%bd%e4%bb%a4)
  - [自动化帮助信息 --help](#%e8%87%aa%e5%8a%a8%e5%8c%96%e5%b8%ae%e5%8a%a9%e4%bf%a1%e6%81%af---help)
    - [自定义帮助](#%e8%87%aa%e5%ae%9a%e4%b9%89%e5%b8%ae%e5%8a%a9)
    - [.usage 和 .name](#usage-%e5%92%8c-name)
    - [.outputHelp(cb)](#outputhelpcb)
    - [.helpOption(flags, description)](#helpoptionflags-description)
    - [.help(cb)](#helpcb)
  - [自定义事件监听](#%e8%87%aa%e5%ae%9a%e4%b9%89%e4%ba%8b%e4%bb%b6%e7%9b%91%e5%90%ac)
  - [零碎知识](#%e9%9b%b6%e7%a2%8e%e7%9f%a5%e8%af%86)
    - [TypeScript](#typescript)
    - [Node 选项例如 `--harmony`](#node-%e9%80%89%e9%a1%b9%e4%be%8b%e5%a6%82---harmony)
    - [Node 调试](#node-%e8%b0%83%e8%af%95)
  - [例子](#%e4%be%8b%e5%ad%90)
  - [许可证](#%e8%ae%b8%e5%8f%af%e8%af%81)
  - [支持](#%e6%94%af%e6%8c%81)

## 安装

```bash
npm install commander
```

## 声明program变量

Commander为了方便快速编程导出了一个全局对象。为简洁起见，本README中的示例中使用了它。

```js
const program = require('commander');
program.version('0.0.1');
```

对于可能以多种方式使用commander的大型程序，包括单元测试，最好创建一个本地Command对象来使用。

```js
const commander = require('commander');
const program = new commander.Command();
program.version('0.0.1');
```

## 选项

`.option()` 方法用来定义带选项的 commander，同时也用于这些选项的文档。每个选项可以有一个短标识(单个字符)和一个长名字，它们之间用逗号或空格分开。

 选项会被放到 Commander 对象的属性上，多词选项如"--template-engine"会被转为驼峰法`program.templateEngine`。多个短标识可以组合为一个参数，如`-a -b -c`等价于`-abc`。

### 常用选项类型，boolean和值

最常用的两个选项类型是boolean(选项后面不跟值)和选项跟一个值（使用尖括号声明）。除非在命令行中指定，否则两者都是`undefined`。

 ```js
const program = require('commander');

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

`program.parse(arguments)`会处理参数，没有被使用的选项会被存放在`program.args`数组中。

### 默认选项值

可以为选项设置一个默认值。

```js
const program = require('commander');

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

### 其他选项类型，可忽略的布尔值和标志值

选项的值为boolean类型时，可以在其长名字前加`no-`规定这个选项值为false。
单独定义同样使选项默认为真。

如果你先定义了`--foo`，再加上`--no-foo`并不会改变它本来的默认值。你可以为一个boolean类型的标识(flag)指定一个默认的布尔值，从命令行里可以重写它的值。

```js
const program = require('commander');

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

你可以指定一个用作标志的选项，它可以接受值（使用方括号声明，即传值不是必须的）。

```js
const program = require('commander');

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

你可以指定一个函数来处理选项的值，接收两个参数：用户传入的值、上一个值(previous value)，它会返回新的选项值。

你可以将选项值强制转换为所需类型，或累积值，或完全自定义处理。

你可以在函数后面指定选项的默认或初始值。

```js
const program = require('commander');

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

### 必需的选项

你可以使用`.requiredOption`指定一个必需的(强制性的)选项，这样的选项在命令行的命令中必须被给出，除非它拥有一个默认的值。另外，这个方法在格式上和使用`.option`一样：The method is otherwise the same as `.option` in format, 采用标志和说明，以及可选的默认值或自定义处理。

```js
const program = require('commander');

program
  .requiredOption('-c, --cheese <type>', 'pizza must have cheese');

program.parse(process.argv);
```

```
$ pizza
error: required option '-c, --cheese <type>' not specified
```

### 版本选项

`version`方法会处理显示版本命令，默认选项标识为`-V`和`--version`，当存在时会打印版本号并退出。

```js
program.version('0.0.1');
```

```bash
$ ./examples/pizza -V
0.0.1
```

你可以自定义标识，通过给`version`方法再传递一个参数，语法与`option`方法一致。版本标识名字可以是任意的，但是必须要有长名字。

```bash
program.version('0.0.1', '-v, --vers', 'output the current version');
```

## Commands

你可以使用 `.command` 为你的最高层命令指定子命令。
这里我们有两种方法可以实现：为命令绑定一个操作处理程序(action handler)，或者将命令单独写成一个可执行文件(稍后我们会详细讨论)。在 `.command` 的第一个参数你可以指定命令的名字以及任何参数。参数可以是 `<required>`(必须的) or `[optional]`(可选的) , 并且最后一个参数也可以是 `variadic...`(可变的).

For example:

```js
// 通过绑定操作处理程序实现命令 (这里description的定义和 `.command` 是分开的)
// 返回新生成的命令(即该子命令)以供继续配置
program
  .command('clone <source> [destination]')
  .description('clone a repository into a newly created directory')
  .action((source, destination) => {
    console.log('clone command called');
  });

// 通过单独分离的可执行文件实现命令 (注意这里description是作为 `.command` 的第二个参数)
// 返回最顶层的命令以供继续添加子命令
program
  .command('start <service>', 'start named service')
  .command('stop [service]', 'stop named service, or all if no name supplied');
```

### 指定参数语法

你可以通过使用 `.arguments` 来为最顶级命令指定参数，对于子命令来说参数都包括在 `.command` 调用之中了。尖括号(e.g. `<required>`)意味着必须的输入，而方括号(e.g. `[optional]`)则是代表了可选的输入

```js
const program = require('commander');

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

一个命令有且仅有最后一个参数是可变的，你需要在参数名后加上 `...` 来使它可变，例如

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

可变参数的值以 `数组` 的形式传递给操作处理程序。(这点同样适用于 `program.args` )

### 操作处理程序(Action handler) (子)命令

你可以使用操作处理程序为一个命令增加选项options。
操作处理程序会接收每一个你声明的参数的变量，和一个额外的参数——这个命令对象自己。这个命令的参数包括添加的命令特定选项的值。

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

当一个命令在命令行上被使用时，它的选项必须是合法的。使用任何未知的选项会报错。然而如果一个基于操作的命令没有定义任何操作，那么这些选项是不合法的。

定义配置选项可以随着调用 `.command()` 传递。
为 `opts.noHelp` 指定 `true` 则该命令不会出现生成的帮助输出里。

### Git 风格的子命令

当 `.command()` 带有描述参数时，不能采用 `.action(callback)` 来处理子命令，否则会出错。这告诉 commander，你将采用单独的可执行文件作为子命令，就像 `git(1)` 和其他流行的工具一样。
Commander 将会尝试在入口脚本（例如 `./examples/pm`）的目录中搜索 `program-command` 形式的可执行文件，例如 `pm-install`, `pm-search`。
你可以使用配置选项 `executableFile` 来指定一个自定义的名字

你可以在可执行文件里处理可执行(子)命令的选项，而不必在顶层声明它们

```js
// file: ./examples/pm
const program = require('commander');

program
  .version('0.1.0')
  .command('install [name]', 'install one or more packages')
  .command('search [query]', 'search with optional query')
  .command('update', 'update installed packages', {executableFile: 'myUpdateSubCommand'})
  .command('list', 'list packages installed', {isDefault: true})
  .parse(process.argv);
```

定义配置选项可以随着调用 `.command()` 传递。为 `opts.noHelp` 指定 `true` 则该命令不会出现生成的帮助输出里。指定 `opts.isDefault` 为 `true` 将会在没有其它子命令指定的情况下，执行该子命令。

使用 `executableFile` 指定一个名字会覆盖默认构造的名称

如果你打算全局安装该命令，请确保可执行文件有对应的权限，例如 `755`。

## 自动化帮助信息 --help

 帮助信息是 commander 基于你的程序自动生成的，下面是 `--help` 生成的帮助信息：

```bash
$ ./examples/pizza --help
Usage: pizza [options]

An application for pizzas ordering

Options:
  -V, --version        output the version number
  -p, --peppers        Add peppers
  -P, --pineapple      Add pineapple
  -b, --bbq            Add bbq sauce
  -c, --cheese <type>  Add the specified type of cheese (default: "marble")
  -C, --no-cheese      You do not want any cheese
  -h, --help           output usage information
```

### 自定义帮助

 你可以通过监听 `--help` 来控制 `-h, --help` 显示任何信息。一旦调用完成， Commander 将自动退出，你的程序的其余部分不会展示。例如在下面的 “stuff” 将不会在执行 `--help` 时输出。

```js
#!/usr/bin/env node

const program = require('commander');

program
  .version('0.0.1')
  .option('-f, --foo', 'enable some foo')
  .option('-b, --bar', 'enable some bar')
  .option('-B, --baz', 'enable some baz');

// must be before .parse() since
// node's emit() is immediate

program.on('--help', function(){
  console.log('');
  console.log('Examples:');
  console.log('  $ custom-help --help');
  console.log('  $ custom-help -h');
});

program.parse(process.argv);

console.log('stuff');
```

下列帮助信息是运行 `node script-name.js -h` or `node script-name.js --help` 时输出的:

```Text
Usage: custom-help [options]

Options:
  -h, --help     output usage information
  -V, --version  output the version number
  -f, --foo      enable some foo
  -b, --bar      enable some bar
  -B, --baz      enable some baz

Examples:
  $ custom-help --help
  $ custom-help -h
```

### .usage 和 .name

这两个选项让你可以自定义在帮助信息第一行中显示的命令使用描述(description)，并且描述是从（完整的）命令参数中推导出来的。例如：

```js
program
  .name("my-command")
  .usage("[global options] command")
```

帮助信息会以此开头：

```Text
Usage: my-command [global options] command
```

### .outputHelp(cb)

输出帮助信息的同时不退出。
可选的回调可在显示帮助文本后处理。
如果你想显示默认的帮助（例如，如果没有提供命令），你可以使用类似的东西：

```js
const program = require('commander');
const colors = require('colors');

program
  .version('0.1.0')
  .command('getstream [url]', 'get stream URL')
  .parse(process.argv);

if (!process.argv.slice(2).length) {
  program.outputHelp(make_red);
}

function make_red(txt) {
  return colors.red(txt); //display the help text in red on the console
}
```

### .helpOption(flags, description)

  重写覆盖默认的帮助标识和描述

```js
program
  .helpOption('-e, --HELP', 'read more information');
```

### .help(cb)

 输出帮助信息并立即退出。
 可选的回调可在显示帮助文本后处理。

## 自定义事件监听

 你可以通过监听命令和选项来执行自定义函数。

```js
// 当有选项verbose时会执行函数
program.on('option:verbose', function () {
  process.env.VERBOSE = this.verbose;
});

// 未知命令会报错
program.on('command:*', function () {
  console.error('Invalid command: %s\nSee --help for a list of available commands.', program.args.join(' '));
  process.exit(1);
});
```

## 零碎知识

### TypeScript

包里包含 TypeScript 定义文件，但是需要你自己安装 node types。如：

```bash
npm install commander
npm install --save-dev @types/node
```

如果你使用 `ts-node` 和 git风格子命令编写 `.ts` 文件, 你需要使用 node 来执行程序以保证正确执行子命令。如：

```bash
node -r ts-node/register pm.ts
```

### Node 选项例如 `--harmony`

你可以采用两种方式启用 `--harmony`：

- 在子命令脚本中加上 `#!/usr/bin/env node --harmony`。注意一些系统版本不支持此模式。
- 在指令调用时加上 `--harmony` 参数，例如 `node --harmony examples/pm publish`。`--harmony` 选项在开启子进程时会被保留。

### Node 调试

如果你在使用 node inspector的 `node -inspect` 等命令来[调试](https://nodejs.org/en/docs/guides/debugging-getting-started/) git风格的可执行命令，
对于生成的子命令，inspector端口递增1。

### 重载退出(exit)处理

默认情况下，当检测到错误以及打印出帮助信息或版本信息时Commander将调用`process.exit`方法。你可以重写覆盖这项操作并提供一个可选的回调。默认的实现会抛出一个`CommanderError`。

重载的回调接受一个包含了 Number类型的`exitCode`、String类型的`code`和`message` 属性的`CommanderError`。除了对可执行子命令完成的异步处理之外，默认的实现方法会抛出这个错。正常情况下，打印错误信息以及帮助或版本信息不会被重载所影响，因为重载的调用在打印之后。

``` js
program.exitOverride();

try {
  program.parse(process.argv);
} catch (err) {
  // 自定义处理...
}
```

## 例子

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

program
  .command('*')
  .action(function(env){
    console.log('deploying "%s"', env);
  });

program.parse(process.argv);
```

更多的 [演示](https://github.com/tj/commander.js/tree/master/examples) 可以在这里找到。

## 许可证

[MIT](https://github.com/tj/commander.js/blob/master/LICENSE)

## 支持

Commander 现在在Node 8以及更高的版本上得到支持。（尽管Commander仍有可能在更低的Node版本上工作，但是Node 8以下版本不再保证相关的测试）

主要的社区支持的免费论坛就在Github上的项目[Issues](https://github.com/tj/commander.js/issues)

[专业支持的commander现在已经可用！](https://tidelift.com/subscription/pkg/npm-commander?utm_source=npm-commander&utm_medium=referral&utm_campaign=readme)

Tidelift为软件开发团队提供了购买和维护其软件的单一来源，并由最了解软件的专家提供专业级保证，同时与现有工具无缝集成。
