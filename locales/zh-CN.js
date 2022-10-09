// The raw translation for Simplified Chinese.
// If you think there is a better way to translate, modify it!

const translations = {
  // errors
  // commander.missingArgument
  "error: missing required argument '{0}'": "错误: 缺少必要的参数 '{0}'",
  // commander.optionMissingArgument
  "error: option '{0}' argument missing": "错误: 选项 '{0}' 缺少参数",
  // commander.missingMandatoryOptionValue
  "error: required option '{0}' not specified": "错误: 未指定必要的选项 '{0}'",
  // commander.conflictingOption
  'error: {0} cannot be used with {1}': '错误: 选项 {0} 不能与 {1} 共同使用',
  // commander.unknownOption
  "error: unknown option '{0}'": "错误: 未知的选项 '{0}'",
  // commander.unknownCommand
  "error: unknown command '{0}'": "错误: 未知的命令 '{0}'",
  // commander.invalidArgument
  // - option from cli
  "error: option '{0}' argument '{1}' is invalid.": "错误: 选项 '{0}' 的参数 '{1}' 无效。",
  // - choices, used for both option and argument
  'Allowed choices are {0}.': '可供选择的是 {0}。',
  // - option from env
  "error: option '{0}' value '{1}' from env '{2}' is invalid.": "错误: 来自环境变量 {2} 的选项 '{0}' 的值 '{1}' 是无效的。",
  // - command-argument
  "error: command-argument value '{0}' is invalid for argument '{1}'.": "错误: 命令参数的值 '{0}' 对参数 '{1}' 无效。",
  // - commander.excessArguments
  "error: too many arguments for command '{0}'": "错误: 命令 '{0}' 收到了过多的参数",
  'error: too many arguments': '错误: 过多的参数',

  // suggest similar
  '(Did you mean one of {0}?)': '(你想输入的是下列中的一个吗？{0})',
  '(Did you mean {0}?)': '(你是否想输入的是 {0} ?)',

  // version option description
  'output the version number': '输出版本号',
  // help option and help command description
  'display help for command': '展示帮助选项',

  // Help
  // titles
  'Usage:': '用法:',
  'Arguments:': '参数列表:',
  'Options:': '选项列表:',
  'Commands:': '命令列表:',
  // usage
  '[options]': '[选项]',
  '[command]': '[命令]',
  // option details (after description)
  'choices: {0}': '可选项: {0}',
  'default: {0}': '默认值: {0}',
  'preset: {0}': '预设值: {0}',
  'env: {0}': '所需环境变量: {0}'
};

exports.translations = translations;
