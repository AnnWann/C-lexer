import { run_state, token } from "../lexical_analysis/types";

export {
  formatLexicalAnalysis,
  join_lexemes,
  join_tokens,
  split_code
}

/**
 * formats the tokenList and idTable into strings to be shown in the view.
 */
function formatLexicalAnalysis(tokenList: token[], idTable: Map<string, string>): string[]{

  const t = tokenList
    .map<string>( (token, i) => `${i}: type: ${token.type} value: ${token.value}`)
    .reduce((prev, curr) => prev + '\n' + curr + '\n');
  
  const i = Array.from(idTable.entries())
    .map<string>( ([key, value], i) => `${key}: ${value}`)
    .reduce( (prev, curr) => prev + '\n' +  curr + '\n');
  
  return [t, i];
}

function join_lexemes(left: run_state, right: run_state){

  const L_lexemes = left.parser.lexemes, L_size = left.parser.lexemes.length;
  if(L_lexemes[L_size - 1].literal){
    const R_lexemes = right.parser.lexemes, R_size = right.parser.lexemes.length
    const char = L_lexemes[L_size - 2].value;
    const type_of_literal = 
      char === '/' ? '\n' :
      char === '\'' || char === '\"' ? char :
      '*'
    
    while(R_lexemes[0].value !== type_of_literal){
      const first = R_lexemes.shift().value;
      R_lexemes[0].value = first + R_lexemes[0].value
    }

    const right_half = R_lexemes.shift(), left_half = L_lexemes[L_size - 1]
    left_half.value += right_half.value;
    left_half.end = right_half.end;
    left.parser.lexemes[L_size - 1] = left_half;
  }

  const n = left;
  n.parser.code = left.parser.code.concat(right.parser.code);

  n.parser.lexemes = left.parser.lexemes.concat(right.parser.lexemes)
  
  return n;
}

function join_tokens(left: run_state, right: run_state){

  console.log('l_size: ' + left.result.tokenList.length + '\nr_size: ' + right.result.tokenList.length);
  const n = left;
  n.result.tokenList = n.result.tokenList.concat(right.result.tokenList);
  
  for (const [key, value] of right.result.idTable) {
    if (!left.result.idTable.has(key)) { 
      left.result.idTable.set(key, value);
    }
  }

  return n;
}

function split_code(code: string): string[]{
  
  const midpoint = Math.floor(code.length / 2);
  let left = midpoint;

  while (left > 0 && /[A-Za-z0-9_]/.test(code[left])) {
    left--;
  }
  
  return [code.slice(0, left), code.slice(left, code.length)];
   
  // Handle strings and comments at join

  // let isInStringOrComment = false;
  // const char = code[0];
  // let i = 0;

  // if (char === '"' || char === "'" || (char === '/' && (code[1] === '/' || code[1] === '*'))){
  //   isInStringOrComment = true;
  //   i += char === '/' ? 2 : 1;
  // }

  // for (; i < left; i++) {
  //   const char = code[i];
  //   if (char === '"' || char === "'" || (char === '/' && (code[i + 1] === '/' || code[i + 1] === '*'))) {
  //     isInStringOrComment = !isInStringOrComment;
  //     if (i !== midpoint - 1) { 
  //       left = i;
  //     }
  //   } else if (char === '\n' || char === '\r' && isInStringOrComment) {
  //     isInStringOrComment = false;
  //     if(char === '\r') i++;
  //   }
  // }

  

}