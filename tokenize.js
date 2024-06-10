const crypto = require("crypto");
const { regex_tokens, regex_stopping_signs as stopping_signs } = require("regexCodes.js");

let idTable  = new Map(); 

function tokenize(code){
  const tokens = [];
  let current_char = 0;

  const regex_s_signs = stopping_signs.keys, s_signs_size = stopping_signs.size;

  let i = 0;
  while(i < code_length){
    for(let q = 0; q < s_signs_size; q++){
      const s_sign_regex = regex_s_signs[q];
      if(s_sign_regex.test(code[i]){
        const lex = getLexeme(i, code, s_sign_name);
        if(!lex.value){
          i += lex.iterations;
          continue;
        }
        tokens.add(makeToken(lex.value));
        i += lex.iterations;
        continue;
      }
    }
  }
}

function getLexeme(i, code, s_sign_regex){
  const s_sign_name = stopping_signs.get(s_sign_regex);
  if(!s_sign_name) throw new Error('unidentified regular expression');
  switch(s_sign_name){
    case 'empty space':
      return { value: undefined, iterations: 1};
    case 'punctuation':
      return { value: code[i], iterations: 1};
    case 'single quote':
      const q = i+2;
      if(!s_sign_regex.test(code[q]) throw new Error('lexical error - unclosed single quote');
      return { value: code.slice(i, q + 1), iterations: 2};
    case 'operators':
      let q = i+1;
      while(q < 2){
        if(!s_sign_regex.test(code[q])) break;
        q++
      }
      return { value: code.slice(i, q + 1), iterations: q - i};
    case m_comment_s: 
      return buildCompoundLexeme(i, code, /\*/);
    case s_comment:
      return buildCompoundLexeme(i, code, /\n/);
    case 'letters and numbers' |'double quote':
       return buildCompoundLexeme(i, code, s_sign_regex);
    default:
     throw new Error('unidentified regular expression');
  }
}

function buildCompoundLexeme(i, code, predicate){
  const end = getEndOfLexeme(i, code, predicate);
  const s_sign_name = stopping_signs.get(s_sign_regex);
  switch(s_sign_name){
    case 'letters and numbers' |'double quote':
      return { value: code.slice(i, end + 1), iterations: end - i};
    case 'm_comment_e' | 'line_b':
       return { value: undefined, iterations: end - i};
  }
}

function getEndOfLexeme(i, code, predicate){
  let q = i+1;
    while(q < code.length){
      if(predicate.test(code[q])){
        return q;
      }
    }
  throw new Error('lexical error - missing symbol: ' + predicate);
}

function setId(lex){
  const lex_sha = createSHA256Hash(lex);
  const id_exists = idTable.get(lex_sha);
  if(!id_exists) idTable.set(lex_sha, lex);
  return {value: lex_sha, type "identifier"}; 
}

function makeToken(lex){
  const s = regex_tokens.size, token_rules = regex_tokens.keys;
  for(let i = 0; i < s; i++)
      if(token_rules[i].test(lex)){
        const token_type = regex_tokens.get(token_rules[i]);
        return token_type == 'identifier' ? setId(lex) : { value: lex, type: token_type }; 
      }; 
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
