const crypto = require("crypto");
const { regex_tokens, regex_stopping_signs } = require("./regexCodes");

const idTable  = new Map();  

function tokenize(code){
  const tokens = [];
  let i = 0;
  while(i < code.length){
    for(const regex of regex_stopping_signs.keys()){
      if(regex.test(code[i])){
        const lex = getLexeme(i, code, regex);
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
  if(!regex_name) throw new Error('unidentified regular expression');
  switch(regex_name){
    case 'empty space':
      return { value: undefined, size: 1};
    case 'punctuation':
      return { value: code[i], size: 1};
    case 'single quote':
      const q = i+2;
      if(!s_sign_regex.test(code[q])) throw new Error('lexical error - unclosed single quote');
      return { value: code.slice(i, q + 1), size: 2};
    case 'operators':
      let w = i+1;
      while(w < 2){
        if(!s_sign_regex.test(code[q])) break;
        w++
      }
      return { value: code.slice(i, q + 1), size: q - i};
    case 'm_comment_s': 
      return buildCompoundLexeme(i, code, (lex) => /\*/.test(lex), 'm_comment_e');
    case 's_comment':
      return buildCompoundLexeme(i, code, (lex) => /\n/.test(lex), 'line_b');
    case 'letters and numbers':
      return buildCompoundLexeme(i, code, (lex) => !regex.test(lex), regex_name);
    case 'double quote':
      return buildCompoundLexeme(i, code, (lex) => regex.test(lex), regex_name);
    default:
     throw new Error('unidentified regular expression');
  }
}

function buildCompoundLexeme(i, code, predicate, regex_name){
  const end = getEndOfLexeme(i, code, predicate);
  switch(regex_name){
    case 'letters and numbers':
      return { value: code.slice(i, end), size: end - i};
    case 'double quote':
      return { value: code.slice(i, end), size: end - i};
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
  const s = regex_tokens.size, token_rules = regex_tokens.keys();
  for(const rule of regex_tokens.keys()){
      if(rule.test(lex)){
        const token_type = regex_tokens.get(rule);
        return token_type == 'identifier' ? setId(lex) : { value: lex, type: token_type }; 
      }
  }
  return { value: lex, type: 'ERROR'};
}

function createSHA256Hash(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}

module.exports = {
  tokenize,
  idTable
}
