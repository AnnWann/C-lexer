import { run_state, token, wrap_run_state } from "../lexical_analysis/types";

export {
  formatLexicalAnalysis,
  join_run_state,
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

function join_run_state(left: run_state, right: run_state){
  const n = wrap_run_state(left.overall_state.code.concat(right.overall_state.code));
  n.overall_state.tokenList = left.overall_state.tokenList.concat(right.overall_state.tokenList);
  n.overall_state.err = left.overall_state.err.concat(right.overall_state.err);
  
  const idTable = left.overall_state.idTable;
  
  right.overall_state.idTable.forEach( (val, key) => {
    if(!idTable.has(key)) idTable.set(key, val);
  });
  

  n.overall_state.idTable = idTable;

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