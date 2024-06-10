const crypto = require("crypto");
const { regex_tokens, regex_stopping_signs } = require("regexCodes.js");

let idTable  = new Map(); 

function tokenize(code){
  const lexemes = [];
  let current_char = 0;
  console.log(code.length)

  while(current_char < code.length){
    const char = code[current_char];

    if(empty_space.test(char)){
      current_char++;
      continue;
    }

    if(letters_numbers.test(char)){
      let lex = "";
      while(letters_numbers.test(code[current_char])){
        if(current_char >= code.length) break;
        lex += code[current_char++];
      }
      lexemes.push(makeToken(lex));
      continue;
    }

    if(punctuation.test(char)){
      lexemes.push(makeToken(lex));
      continue;
    }

    if(double_quote.test(char)){
      let lex = char;
      current_char++;
      while(!double_quote.test(code[current_char]))
        lex += code[current_char++];
      lexemes.push(makeToken);
      continue;
    }

    if(single_quote.test(char)){
      let lex = char;
      current_char++;
      while(!single_quote.test(code[current_char]))
        lex += code[current_char++];
      
      lexemes.push(makeToken);
      continue;
    }

    if(m_comment_e.test(lex)){
      while(!m_comment_s.test(code[current_char++]));
      continue;
    }

    if(s_comment.test(lex)){
      while(!line_b.test(code[current_char++]));
      continue;
    }

    let lex = char;
    current_char++
    while(operators.test(code[current_char]))
      lex += code[current_char++];
    
    lexemes.push(makeToken);
  }
  return lexemes; 
}

function setId(lex){
  const lex_sha = createSHA256Hash(lex);
  const id_exists = idTable.get(lex_sha);
  if(!id_exists) idTable.set(lex_sha, lex);
  return {value: lex_sha, type "identifier"}; 
}

function makeToken(lex){
  const s = regex_tokens.size, token_rules = regex_tokens.keys;
  for(int i = 0; i < s; i++)
      if(token_rules[i].test(lex)){
        const token_type = regex_tokens.get(token_rules[i]);
        return token_type == 'identifier' ? setId(lex) : { value: lex, type: token_type }; 
      }; 
  return { value: lex, type: 'ERROR'};
}

const empty_space = /\s/;
const letters_numbers = /[A-Za-z_0-9_]/;
const punctuation = /\{|\}|\(|\)|\[|\]|;|.|,|:/;
const double_quote = /"/;
const single_quote = /'/;
const m_comment_s = /\/\*/;
const m_comment_e = /\*/;
const s_comment = /\/\//;
const line_b = /\n/;
const operators = /=|!|<|>|\+|-|\*\/|>|<|\||&/;

function createSHA256Hash(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}

module.exports = {
  tokenize,
  idTable
}
