const { computeSimilar } = require('../');
const { suggestSimilar } = require('../lib/suggestSimilar');

describe('computeSimilar', () => {

    test.each([
        ['No candidates', 'foo', [], []],
        ['No similar candidates', 'foo', ['bar', 'bar'], []],
        ['One similar candidates', 'bar', ['foo', 'baz'], ['baz']],
        ['Multiple similar candidates', 'bar', ['foo', 'baz', 'far'], ['baz', 'far']]
    ])(`%s`, (_name, word, candidates, similar) => {
        expect(computeSimilar(word, candidates)).toEqual(similar);
    });

});

describe('suggestSimilar', () => {

    test.each([
        ['No candidates', 'foo', [], ''],
        ['No similar candidates', 'foo', ['bar', 'bar'], ''],
        ['One similar candidates', 'bar', ['foo', 'baz'], '\n(Did you mean baz?)'],
        ['Multiple similar candidates', 'bar', ['foo', 'baz', 'far'], '\n(Did you mean one of baz, far?)']
    ])(`%s`, (_name, word, candidates, similar) => {
        expect(suggestSimilar(word, candidates)).toEqual(similar);
    });

});