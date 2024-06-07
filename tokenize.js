const crypto = require("crypto");

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
  return {val: lex_sha, code: "id"}; 
}





function makeToken(lex){    
    if(identifiers.test(lex)) return setId(lex);
    if(numbers.test(lex)) return { val: lex, code: 'number' };
    if(keywords.test(lex)) return { val: lex, code: lex };
    if(comparison.test(lex)) return { val: lex, code: 'comparison' };
    if(add.test(lex)) return { val: lex, code: 'add' };
    if(subtract.test(lex)) return { val: lex, code: 'subtract' };
    if(multiply_pointer.test(lex)) return { val: lex, code: 'multiply' };
    if(divide.test(lex)) return { val: lex, code: 'divide' };
    if(bitwise_and.test(lex)) return { val: lex, code: 'bitwise_and' };
    if(bitwise_or.test(lex)) return { val: lex, code: 'bitwise_or' };
    if(bitwise_xor.test(lex)) return { val: lex, code: 'bitwise_xor' };
    if(bitwise_not.test(lex)) return { val: lex, code: 'bitwise_not' };
    if(bitwise_shift.test(lex)) return { val: lex, code: lex == "<<" ? 'L_bitwise_shift' : 'R_bitwise_shift'};
    if(assign.test(lex)) return { val: lex, code: 'assign' };
    if(compound_assign.test(lex)) return { val: lex, code: 'compound_assign' };
    if(logical_and.test(lex)) return { val: lex, code: 'logical_and' };
    if(logical_or.test(lex)) return { val: lex, code: 'logical_or' };
    if(dot.test(lex)) return {val: lex, code: 'dot'};
    if(comma.test(lex)) return {val: lex, code: 'comma'} 
    if(colon.test(lex)) return {val: lex, code: 'colon'};
    if(semicolon.test(lex)) return {val: lex, code: 'semicolon'};
    if(arrow.test(lex)) return {val: lex, code: 'arrow'};
    if(braces.test(lex)) return { val: lex, code: lex === '[' ? 'bc_open' : 'bc_close' };
    if(parentheses.test(lex)) return { val: lex, code: lex === '(' ? 'p_open' : 'p_close' };
    if(brackets.test(lex)) return { val: lex, code: lex === '{' ? 'bt_open' : 'bt_close'};
    if(strings.test(lex)) return { val: lex, code: 'string' };
    if(char_literal.test(lex)) return { val: lex[1], code: 'char_literal' }; 
    return { val: lex, code: 'ERROR'};
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
const identifiers = /[a-zA-Z_][a-zA-Z0-9_]*/;
const numbers = /^-?\d+(\.\d+)?([eE][+-]?\d+)?/;
const keywords = /int|float|double|long|char|short|void|return|if|else|while|for|break|continue/;
const comparison = /==|!=|<=|>=|<|>/;
const add = /\+/;
const subtract = /-/;
const multiply_pointer = /\*/;
const divide = /\//;
const bitwise_and = /&/;
const bitwise_or = /\|/;
const bitwise_xor = /\^/;
const bitwise_not = /~/;
const bitwise_shift = /<<|>>/;
const assign = /=/;
const compound_assign = /\+=|\-=|\*=|\/=|%=|<<=|>>=|&=|\|=|^=/;
const logical_and = /&&/;
const logical_or = /\|\|/;
const dot = /\./;
const comma = /\,/;
const colon = /\:/;
const semicolon = /\;/;
const arrow = /->/;
const braces = /\[|\]/;
const parentheses = /\(|\)/;
const brackets = /\{|\}/;
const strings = /\"([^\\\"]|\\["\\bfnrt"\\])*\"/;
const char_literal = /\'(.)\'/;

function createSHA256Hash(inputString) {
  const hash = crypto.createHash('sha256');
  hash.update(inputString);
  return hash.digest('hex');
}

module.exports = {
  tokenize,
  idTable
}