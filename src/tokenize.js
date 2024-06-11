const { regex_tokens, regex_stopping_signs } = require("./regexCodes");
const createSHA256Hash = require("./hash");

const idTable  = new Map();  

function tokenize(code){
  const tokens = [];
  let i = 0;
  while(i < code.length){
    for(const regex of regex_stopping_signs.keys()){
      if(regex.test(code[i])){
        const lex = 
          code[i] == '-' && getKeyByValue(regex_tokens, 'numeral').test(code[i+1])
          ? getLexeme(i, code, getKeyByValue(regex_stopping_signs, 'letters and numbers')) 
          : getLexeme(i, code, regex);
        if(!lex.value){
          i += lex.size;
          break;
        }
        tokens.push(makeToken(lex.value));
        i += lex.size;
        break;
      }
    }
  }
  return tokens;
}
function getLexeme(i, code, regex){
  const regex_name = regex_stopping_signs.get(regex);
  switch(regex_name){
    case 'empty space':
      return { value: undefined, size: 1};
    case 'punctuation':
      return { value: code[i], size: 1};
    case 'single quote':
      const q = i+2;
      if(!regex.test(code[q])) throw new Error('lexical error - unclosed single quote');
      return { value: code.slice(i, q + 1), size: 3};
    case 'operators':
      let w = i+1;
      while(w < i + 3){
        if(code[w] === '\r') break;
        if(!regex.test(code[w])) break;
        w++
      }
      return { value: code.slice(i, w), size: w - i};
    case 'm_comment_s': 
      return buildCompoundLexeme(i, code, (lex) => /\*/.test(lex), 'm_comment_e');
    case 's_comment':
      return buildCompoundLexeme(i, code, (lex) => /\n/.test(lex), 'line_b');
    case 'letters and numbers':
      return buildCompoundLexeme(i, code, (lex) => !regex.test(lex), regex_name);
    case 'double quote':
      return buildCompoundLexeme(i, code, (lex) => regex.test(lex), regex_name);
    default:
     throw new Error('unidentified regular expression: ' + code[i]);
  }
}

function buildCompoundLexeme(i, code, predicate, regex_name){
  const end = getEndOfLexeme(i, code, predicate);
  switch(regex_name){
    case 'letters and numbers':
      return { value: code.slice(i, end), size: end - i};
    case 'double quote':
      return { value: code.slice(i, end + 1), size: end - i + 1};
    case 'm_comment_e':
       return { value: undefined, size: end - i};
    case 'line_b':
       return { value: undefined, size: end - i};
  }
}

function getEndOfLexeme(i, code, predicate){
  let q = i+1;
    while(q <= code.length){
      if(predicate(code[q]) | !code[q]){
        return q;
      }
      q++;
    }
  throw new Error('lexical error - missing symbol: ' + predicate);
}

function setId(lex){
  const lex_hash = createSHA256Hash(lex);
  if(!idTable.get(lex_hash)) idTable.set(lex_hash, lex);
  return { value: lex_hash, type: 'identifier' }; 
}

function makeToken(lex){
  for(const rule of regex_tokens.keys()){
      if(rule.test(lex)){
        const token_type = regex_tokens.get(rule);
        return token_type == 'identifier' ? setId(lex) : { value: lex, type: token_type }; 
      }
  }
  return { value: lex, type: 'ERROR'};
}

function getKeyByValue(map, value) {
  for (const [key, mapValue] of map.entries()) {
    if (mapValue === value) {
      return key;
    }
  }
  return undefined;
}

module.exports = {
  tokenize,
  idTable
}
