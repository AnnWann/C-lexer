const { tokenize } = require("../src/tokenize")

const keywords = [
  'auto',
  'break',
  'case',
  'char', 
  'const', 
  'continue', 
  'default', 
  'do', 
  'double', 
  'else', 
  'enum', 
  'extern', 
  'float', 
  'for', 
  'goto', 
  'if', 
  'int', 
  'long', 
  'register',
  'return', 
  'short', 
  'signed', 
  'sizeof', 
  'static', 
  'struct', 
  'switch', 
  'typedef', 
  'union', 
  'unsigned', 
  'void',
  'volatile', 
  'while',
];

const comparisons = [
  '==', '!=', '<=', '>=', '<', '>',
]

const compound_assigns = [
  '+=', '-=', '*=', '/=', '%=', '<<=', '>>=', '&=', '|=', '^=',
]

test('keywords test', () => {
  const keywords_tokenized = keywords.map((keyword) => tokenize(keyword).at(0));
  let i = 0;
  for(const token of keywords_tokenized){
    const expected_token = { value: keywords[i++], type: 'keyword' };
    expect(token).toEqual(expected_token);
  }
});

test('string test', () => {
  const expected_token = { value: '"this is a string"', type: 'string' };
  expect(tokenize('"this is a string"').at(0)).toEqual(expected_token)
});

test('natural numeral test', () => {
  const expected_token = { value: '20', type: 'numeral' };
  expect(tokenize('20').at(0)).toEqual(expected_token)
});

test('negative numeral test', () => {
  const expected_token = { value: '-20', type: 'numeral' };
  expect(tokenize('-20').at(0)).toEqual(expected_token)
});

test('decimal numeral test', () => {
  const expected_token = { value: '2.5', type: 'numeral' };
  expect(tokenize('2.5').at(0)).toEqual(expected_token)
});

test('arrow test', () => {
  const expected_token = { value: '->', type: 'arrow' };
  expect(tokenize('->').at(0)).toEqual(expected_token)
});

test('comparison test', () => {
  const comparison_tokenized = comparisons.map((comparison) => tokenize(comparison).at(0));
  let i = 0;
  for(const token of comparison_tokenized){
    const expected_token = { value: comparisons[i++], type: 'comparison' };
    expect(token).toEqual(expected_token);
  }
});

test('logical_and test', () => {
  const expected_token = { value: '&&', type: 'logical_and' };
  expect(tokenize('&&').at(0)).toEqual(expected_token)
});

test('logical_or test', () => {
  const expected_token = { value: '||', type: 'logical_or' };
  expect(tokenize('||').at(0)).toEqual(expected_token)
});

test('compound assign test', () => {
  const compound_assign_tokenized = compound_assigns.map((compound_assign) => tokenize(compound_assign).at(0));
  let i = 0;
  for(const token of compound_assign_tokenized){
    const expected_token = { value: compound_assigns[i++], type: 'compound_assign' };
    expect(token).toEqual(expected_token);
  }
});

test('bitwise shift test', () => {
  const expected_token1 = { value: '<<', type: 'bitwise_shift' };
  const expected_token2 = { value: '>>', type: 'bitwise_shift' };
  expect(tokenize('<<').at(0)).toEqual(expected_token1);
  expect(tokenize('>>').at(0)).toEqual(expected_token2);
});

test('increment test', () => {
  const expected_token = { value: '++', type: 'increment' };
  expect(tokenize('++').at(0)).toEqual(expected_token)
});

test('decrement test', () => {
  const expected_token = { value: '--', type: 'decrement' };
  expect(tokenize('--').at(0)).toEqual(expected_token)
});

test('deny test', () => {
  const expected_token = { value: '!', type: 'deny' };
  expect(tokenize('!').at(0)).toEqual(expected_token)
});

test('add test', () => {
  const expected_token = { value: '+', type: 'add' };
  expect(tokenize('+').at(0)).toEqual(expected_token)
});