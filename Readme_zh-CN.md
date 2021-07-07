# Commander.js

[![Build Status](https://github.com/tj/commander.js/workflows/build/badge.svg)](https://github.com/tj/commander.js/actions?query=workflow%3A%22build%22)
[![NPM Version](http://img.shields.io/npm/v/commander.svg?style=flat)](https://www.npmjs.org/package/commander)
[![NPM Downloads](https://img.shields.io/npm/dm/commander.svg?style=flat)](https://npmcharts.com/compare/commander?minimal=true)
[![Install Size](https://packagephobia.now.sh/badge?p=commander)](https://packagephobia.now.sh/result?p=commander)

完整的 [node.js](http://nodejs.org) 命令行解决方案。

使用其他语言阅读：[English](./Readme.md) | 简体中文

Note: this document still describes Commander v7 and has not yet been updated for Commander v8.

- [Commander.js](#commanderjs)
  - [安装](#%e5%ae%89%e8%a3%85)
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
    - [设置命令参数](#%E8%AE%BE%E7%BD%AE%E5%91%BD%E4%BB%A4%E5%8F%82%E6%95%B0)
    - [处理函数](#%E5%A4%84%E7%90%86%E5%87%BD%E6%95%B0)
    - [独立的可执行（子）命令](#%E7%8B%AC%E7%AB%8B%E7%9A%84%E5%8F%AF%E6%89%A7%E8%A1%8C%EF%BC%88%E5%AD%90%EF%BC%89%E5%91%BD%E4%BB%A4)
  - [自动化帮助信息](#%e8%87%aa%e5%8a%a8%e5%8c%96%e5%b8%ae%e5%8a%a9%e4%bf%a1%e6%81%af)
    - [自定义帮助](#%e8%87%aa%e5%ae%9a%e4%b9%89%e5%b8%ae%e5%8a%a9)
    - [使用代码展示帮助信息](#%E4%BD%BF%E7%94%A8%E4%BB%A3%E7%A0%81%E5%B1%95%E7%A4%BA%E5%B8%AE%E5%8A%A9%E4%BF%A1%E6%81%AF)
    - [.usage 和 .name](#usage-%e5%92%8c-name)
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
    - [导入到 ES 模块](#%E5%AF%BC%E5%85%A5%E5%88%B0%20ES%20%E6%A8%A1%E5%9D%97)
    - [Node 选项 --harmony](#node-%e9%80%89%e9%a1%b9---harmony)
    - [调试子命令](#%e8%b0%83%e8%af%95%e5%ad%90%e5%91%bd%e4%bb%a4)
    - [重写退出和输出](#%E9%87%8D%E5%86%99%E9%80%80%E5%87%BA%E5%92%8C%E8%BE%93%E5%87%BA)
    - [其他文档](#%E5%85%B6%E4%BB%96%E6%96%87%E6%A1%A3)
  - [例子](#%e4%be%8b%e5%ad%90)
  - [支持](#%e6%94%af%e6%8c%81)
    - [企业使用 Commander](#%e4%bc%81%e4%b8%9a%e4%bd%bf%e7%94%a8-commander)

关于本文档中使用的术语，请见[术语表](./docs/zh-CN/%E6%9C%AF%E8%AF%AD%E8%A1%A8.md)

## 安装

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/installation.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

## 声明 program 变量

为简化使用，Commander 提供了一个全局对象。本文档的示例代码均按此方法使用：

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example1.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

如果程序较为复杂，用户需要以多种方式来使用 Commander，如单元测试等。创建本地 Command 对象是一种更好的方式：

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example2.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->
## 选项

Commander 使用`.option()` 方法来定义选项，同时可以附加选项的简介。每个选项可以定义一个短选项名称（-后面接单个字符）和一个长选项名称（--后面接一个或多个单词），使用逗号、空格或`|`分隔。

选项可以通过在`Command`对象上调用`.opts()`方法来获取。对于多个单词的长选项，使用驼峰法获取，例如`--template-engine`选项通过`program.opts().templateEngine`获取。

多个短选项可以合并简写，其中最后一个选项可以附加参数。
例如，`-a -b -p 80` 也可以写为 `-ab -p80` ，甚至进一步简化为 `-abp80`。

`--`可以标记选项的结束，后续的参数均不会被命令解释，可以正常使用。

默认情况下，选项在命令行中的顺序不固定，一个选项可以在其他参数之前或之后指定。

### 常用选项类型，boolean 型选项和带参数选项

有两种最常用的选项，一类是 boolean 型选项，选项无需配置参数，另一类选项则可以设置参数（使用尖括号声明在该选项后，如`--expect <value>`）。如果在命令行中不指定具体的选项及参数，则会被定义为`undefined`。

示例代码：[options-common.js](./examples/options-common.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-common.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/common-option-types-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

通过`program.parse(arguments)`方法处理参数，没有被使用的选项会存放在`program.args`数组中。该方法的参数是可选的，默认值为`process.argv`。

### 选项的默认值

选项可以设置一个默认值。

示例代码：[options-defaults.js](./examples/options-defaults.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-defaults.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-defaults-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 其他的选项类型，取反选项，以及可选参数的选项

可以定义一个以`no-`开头的`boolean`型长选项。在命令行中使用该选项时，会将对应选项的值置为false。当只定义了带`no-`的选项，未定义对应不带`no-`的选项时，该选项的默认值会被置为true。

如果已经定义了`--foo`，那么再定义`--no-foo`并不会改变它本来的默认值。可以为一个`boolean`类型的选项指定一个默认的布尔值，在命令行里可以重写它的值。

示例代码：[options-negatable.js](./examples/options-negatable.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-negatable.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-negatable-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

选项的参数使用方括号声明表示参数是可选参数（如 `--optional [value]`）。该选项在不带参数时可用作boolean选项，在带有参数时则从参数中得到值。

示例代码：[options-boolean-or-value.js](./examples/options-boolean-or-value.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-boolean-or-value.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-boolean-or-value-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

关于可能有歧义的用例，请见[可变参数的选项](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)。

### 必填选项

通过`.requiredOption`方法可以设置选项为必填。必填选项要么设有默认值，要么必须在命令行中输入，对应的属性字段在解析时必定会有赋值。该方法其余参数与`.option`一致。

示例代码：[options-required.js](./examples/options-required.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-required.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-required-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 变长参数选项

定义选项时，可以通过使用`...`来设置参数为可变长参数。在命令行中，用户可以输入多个参数，解析后会以数组形式存储在对应属性字段中。在输入下一个选项前（-或--开头），用户输入的指令均会被视作变长参数。与普通参数一样的是，可以通过`--`标记当前命令的结束。

示例代码：[options-variadic.js](./examples/options-variadic.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-variadic.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-variadic-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

关于可能有歧义的用例，请见[可变参数的选项](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)。

### 版本选项

`version`方法可以设置版本，其默认选项为`-V`和`--version`，设置了版本后，命令行会输出当前的版本号。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/version-option.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/version-option-output.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

```bash
$ ./examples/pizza -V
0.0.1
```

版本选项也支持自定义设置选项名称，可以在`version`方法里再传递一些参数（长选项名称，描述信息），用法与`option`方法类似。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/version-option-additional-parameter.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 其他选项配置

大多数情况下，选项均可通过`.option()`方法添加。但对某些不常见的用例，也可以直接构造`Option`对象，对选项进行更详尽的配置。

示例代码： [options-extra.js](./examples/options-extra.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-extra.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-extra-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 自定义选项处理

选项的参数可以通过自定义函数来处理，该函数接收两个参数：用户新输入的参数值和当前已有的参数值（即上一次调用自定义处理函数后的返回值），返回新的选项参数值。

自定义函数适用场景包括参数类型转换，参数暂存，或者其他自定义处理的场景。

可以在自定义函数的后面设置选项参数的默认值或初始值（例如参数用`list`暂存时需要设置一个初始空集合)。

示例代码：[options-custom-processing.js](./examples/options-custom-processing.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/options-custom-processing.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/options-custom-processing-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

## 命令

通过`.command()`或`.addCommand()`可以配置命令，有两种实现方式：为命令绑定处理函数，或者将命令单独写成一个可执行文件（详述见后文）。子命令支持嵌套（[示例代码](./examples/nestedCommands.js)）。

`.command()`的第一个参数可以配置命令名称及命令参数，参数支持必选（尖括号表示）、可选（方括号表示）及变长参数（点号表示，如果使用，只能是最后一个参数）。

使用`.addCommand()`向`program`增加配置好的子命令。

例如:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/command.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

使用`.command()`和`addCommand()`来传递配置的选项。当设置`hidden: true`时，该命令不会打印在帮助信息里。当设置`isDefault: true`时，若没有指定其他子命令，则会默认执行这个命令（[样例](./examples/defaultCommand.js)）。

### 设置命令参数

通过`.arguments`可以为最顶层命令指定命令参数，对子命令而言，参数都包括在`.command`调用之中了。尖括号（例如`<required>`）意味着必选，而方括号（例如`[optional]`）则代表可选。可以向`.description()`方法传递第二个参数，从而在帮助中展示命令参数的信息。该参数是一个包含了 “命令参数名称：命令参数描述” 键值对的对象。

示例代码：[arguments.js](./examples/arguments.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/argument.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

在参数名后加上`...`来声明可变参数，且只有最后一个参数支持这种用法，例如

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/vardiac-argument.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

可变参数会以数组的形式传递给处理函数。

### 处理函数

命令处理函数的参数，为该命令声明的所有参数，除此之外还会附加两个额外参数：一个是解析出的选项，另一个则是该命令对象自身。

示例代码：[thank.js](./examples/thank.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/thank.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->


处理函数支持`async`，相应的，需要使用`.parseAsync`代替`.parse`。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/async-action-handler.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->


在命令行上使用命令时，选项和命令参数必须是合法的，使用未知的选项，或缺少所需的命令参数，会提示异常。
如要允许使用未知的选项，可以调用`.allowUnknownOption()`。默认情况下，传入过多的参数并不报错，但也可以通过调用`.allowExcessArguments(false)`来启用过多参数的报错。

### 独立的可执行（子）命令

当`.command()`带有描述参数时，就意味着使用独立的可执行文件作为子命令。
Commander 将会尝试在入口脚本（例如 `./examples/pm`）的目录中搜索`program-command`形式的可执行文件，例如`pm-install`, `pm-search`。通过配置选项`executableFile`可以自定义名字。

你可以在可执行文件里处理（子）命令的选项，而不必在顶层声明它们。

示例代码：[pm](./examples/pm)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/pm) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

如果该命令需要支持全局安装，请确保有对应的权限，例如`755`。

## 自动化帮助信息

帮助信息是 Commander 基于你的程序自动生成的，默认的帮助选项是`-h,--help`。

示例代码：[pizza](./examples/pizza)

```bash
$ node ./examples/pizza --help
Usage: pizza [options]

An application for pizza ordering

Options:
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

可以添加额外的帮助信息，与内建的帮助一同展示。

示例代码： [custom-help](./examples/custom-help)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/custom-help) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

将会输出以下的帮助信息

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/custom-help-cli.sh) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

位置参数对应的展示方式如下：

- `beforeAll`：作为全局标头栏展示
- `before`：在内建帮助信息之前展示
- `after`：在内建帮助信息之后展示
- `afterAll`：作为全局末尾栏展示

`beforeAll`和`afterAll`两个参数作用于命令及其所有的子命令。

第二个参数可以是一个字符串，也可以是一个返回字符串的函数。对后者而言，为便于使用，该函数可以接受一个上下文对象，它有如下属性：

- error：boolean值，代表该帮助信息是否由于不当使用而展示
- command: 代表展示该帮助信息的Command对象

### 使用代码展示帮助信息

`.help()`：展示帮助信息并退出。可以通过传入`{ error: true }`来将帮助信息作为stderr输出，并以代表错误的状态码退出程序。

`.outputHelp()`：只展示帮助信息，不退出程序。传入`{ error: true }`可以将帮助信息作为stderr输出。

`.helpInformation()`： 得到字符串形式的内建的帮助信息，以便用于自定义的处理及展示。

### .usage 和 .name

通过这两个选项可以修改帮助信息的首行提示，name 属性也可以从参数中推导出来。例如：

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/usage.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->


### .helpOption(flags, description)

每一个命令都带有一个默认的帮助选项。可以重写flags和description参数。传入false则会禁用内建的帮助信息。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/help-option.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### .addHelpCommand()

如果一个命令拥有子命令，它也将有一个默认的帮助子命令。使用`.addHelpCommand()`和`.addHelpCommand(false)`可以打开或关闭默认的帮助子命令。

也可以自定义名字和描述：

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/add-help-command.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 其他帮助配置

内建帮助信息通过Help类进行格式化。如有需要，可以使用`.configureHelp()`来更改其数据属性和方法，或使用`.createHelp()`来创建子类，从而配置Help类的行为。

数据属性包括：
- `helpWidth`：指明帮助信息的宽度。可在单元测试中使用。
- `sortSubcommands`：以字母序排列子命令
- `sortOptions`：以字母序排列选项

可以得到可视化的参数列表，选项列表，以及子命令列表。列表的每个元素都具有_term_和_description_属性，并可以对其进行格式化。关于其使用方式，请参考`.formatHelp()`。

示例代码： [configure-help.js](./examples/configure-help.js)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/configure-help.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

## 自定义事件监听

监听命令和选项可以执行自定义函数。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/custom-event-listeners.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->
## 零碎知识

### .parse() 和 .parseAsync()

`.parse`的第一个参数是要解析的字符串数组，也可以省略参数而使用`process.argv`。

如果参数遵循与 node 不同的约定，可以在第二个参数中传递`from`选项：

- 'node': 默认值，`argv[0]`是应用，`argv[1]`是要跑的脚本，后续为用户参数；
- 'electron': `argv[1]`根据 electron 应用是否打包而变化；
- 'user': 来自用户的所有参数。

比如:

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/parse.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 解析配置

当默认的解析方式无法满足需要，Commander也提供了其他的解析行为。

默认情况下，程序的选项在子命令前后均可被识别。如要只允许选项出现在子命令之前，可以使用`.enablePositionalOptions()`。这样可以在命令和子命令中使用意义不同的同名选项。

示例代码：[positional-options.js](./examples/positional-options.js)

当启用了带顺序的选项解析，以下程序中，`-b`选项在第一行中将被解析为程序顶层的选项，而在第二行中则被解析为子命令的选项：

```sh
program -b subcommand
program subcommand -b
```

默认情况下，选项在命令参数前后均可被识别。如要使选项仅在命令参数前被识别，可以使用`.passThroughOptions()`。这样可以把参数和跟随的选项传递给另一程序，而无需使用`--`来终止选项解析。
如要在子命令中使用此功能，必须首先启用带顺序的选项解析。

示例代码： [pass-through-options.js](./examples/pass-through-options.js)

当启用此功能时，以下程序中，`--port=80`在第一行中会被解析为程序的选项，而在第二行中则会被解析为一个命令参数：

```sh
program --port=80 arg
program arg --port=80
```

默认情况下，使用未知选项会提示错误。如要将未知选项视作普通命令参数，并继续处理其他部分，可以使用`.allowUnknownOption()`。这样可以混用已知和未知的选项。

默认情况下，传入过多的命令参数并不会报错。可以使用`.allowExcessArguments(false)`来启用这一检查。

### 作为属性的遗留选项

在 Commander 7 以前，选项的值是作为属性存储在command对象上的。
这种处理方式便于实现，但缺点在于，选项可能会与`Command`的已有属性相冲突。通过使用`.storeOptionsAsProperties()`，可以恢复到这种旧的处理方式，并可以不加改动的继续运行遗留代码。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/legacy-options-properties.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### TypeScript

Commander 包里包含了 TypeScript 定义文件。

如果使用`.ts`格式编写命令，则需要通过 node 来执行命令。如：

```bash
node -r ts-node/register pm.ts
```

### createCommand()

使用工厂方法可以创建一个`command`，此时不需要使用`new`方法，如

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/create-command.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

`createCommand`是 command 对象的一个方法，可以创建一个新的命令（而非子命令），使用`command()`创建子命令时内部会调用该方法，具体使用方式可参考[custom-command-class.js](./examples/custom-command-class.js)。

### 导入到 ES 模块

Commander 是一个 CommonJS 包，支持导入到 ES 模块中去。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/program-variable-example3.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### Node 选项 --harmony

启用`--harmony`有以下两种方式：

- 在子命令脚本中加上`#!/usr/bin/env node --harmony`。注：Windows 系统不支持；
- 调用时加上`--harmony`参数，例如`node --harmony examples/pm publish`。`--harmony`选项在开启子进程时仍会保留。

### 调试子命令

一个可执行的子命令会作为单独的子进程执行。

如果使用 node inspector 的`node -inspect`等命令来[调试](https://nodejs.org/en/docs/guides/debugging-getting-started/)可执行命令，对于生成的子命令，inspector 端口会递增1。

如果想使用 VSCode 调试，则需要在`launch.json`配置文件里设置`"autoAttachChildProcesses": true`。

### 重写退出和输出

默认情况下，在检测到错误、打印帮助信息或版本信息时 Commander 会调用`process.exit`方法。其默认实现会抛出一个`CommanderError`，可以重写该方法并提供一个回调函数（可选）。

回调函数的参数为`CommanderError`，属性包括 Number 型的`exitCode`、String 型的`code`和`message`。子命令完成调用后会开始异步处理。正常情况下，打印错误信息、帮助信息或版本信息不会被重写影响，因为重写会发生在打印之后。

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/Readme/exit-override.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

Commander默认用作命令行应用，其输出写入stdout和stderr。
对于其他应用类型，这一行为可以修改。并且可以修改错误信息的展示方式。

示例代码：[configure-output.js](./examples/configure-output.js)


<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/configure-output.js) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

### 其他文档

请参考关于如下话题的其他文档：

- [不再推荐使用的功能](./docs/zh-CN/%E4%B8%8D%E5%86%8D%E6%8E%A8%E8%8D%90%E4%BD%BF%E7%94%A8%E7%9A%84%E5%8A%9F%E8%83%BD.md)。这些功能仍受到支持，以保证向后兼容。
- [可变参数的选项](./docs/zh-CN/%E5%8F%AF%E5%8F%98%E5%8F%82%E6%95%B0%E7%9A%84%E9%80%89%E9%A1%B9.md)

## 例子

在只包含一个命令的程序中，无需定义处理函数。

示例代码：[pizza](./examples/pizza)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/pizza) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

在包含多个命令的程序中，应为每个命令指定处理函数，或独立的可执行程序。

示例代码：[deploy](./examples/deploy)

<!-- MARKDOWN-AUTO-DOCS:START (CODE:src=./examples/deploy) -->
<!-- MARKDOWN-AUTO-DOCS:END -->

更多的示例代码点击[这里](https://github.com/tj/commander.js/tree/master/examples)查看。

## 支持

当前版本的Commander在LTS版本的Node上完全支持。Node版本应不低于v10。
（使用更低版本Node的用户建议安装更低版本的Commander。Commander 2.x具有最广泛的支持。）

社区支持请访问项目的 [Issues](https://github.com/tj/commander.js/issues)。

### 企业使用 Commander

现在 Commander 已作为 Tidelift 订阅的一部分。

Commander 和很多其他包的维护者已与 Tidelift 合作，面向企业提供开源依赖的商业支持与维护。企业可以向相关依赖包的维护者支付一定的费用，帮助企业节省时间，降低风险，改进代码运行情况。[了解更多](https://tidelift.com/subscription/pkg/npm-commander?utm_source=npm-commander&utm_medium=referral&utm_campaign=enterprise&utm_term=repo)
