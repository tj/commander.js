var program = require('../')
  , should = require('should');

var translations = {
    'Usage:': 'Применение:',
    'Commands:': 'Команды:',
    'Arguments:': 'Аргументы:',
    'Options:': 'Опции:',
    'output usage information': 'информация об использовании',
    'application simple description': 'простое описание приложения',
    'env value': 'значение env'
};

program.translator = function(str) {
    return translations[str] || str;
};

program
    .helpInformation()
    .should.equal([
        '',
        '  Применение:  [options]',
        '',
        '  Опции:',
        '',
        '    -h, --help  информация об использовании',
        ''
    ].join('\n'));

program
    .command('mycommand [env]')
    .description('application simple description', { env: 'env value' })
    .helpInformation()
    .should.equal([
        '',
        '  Применение: mycommand [options] [env]',
        '',
        '  простое описание приложения',
        '',
        '  Аргументы:',
        '',
        '    env         значение env',
        '',
        '  Опции:',
        '',
        '    -h, --help  информация об использовании',
        ''
    ].join('\n'));
