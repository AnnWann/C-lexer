"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatLexicalAnalysis = formatLexicalAnalysis;
exports.join_run_state = join_run_state;
exports.split_code = split_code;
const types_1 = require("../lexical_analysis/types");
/**
 * formats the tokenList and idTable into strings to be shown in the view.
 */
function formatLexicalAnalysis(tokenList, idTable) {
    const t = tokenList
        .map((token, i) => `${i}: type: ${token.type} value: ${token.value}`)
        .reduce((prev, curr) => prev + '\n' + curr + '\n');
    const i = Array.from(idTable.entries())
        .map(([key, value], i) => `${key}: ${value}`)
        .reduce((prev, curr) => prev + '\n' + curr + '\n');
    return [t, i];
}
function join_run_state(left, right) {
    const n = (0, types_1.wrap_run_state)(left.overall_state.code.concat(right.overall_state.code));
    n.overall_state.tokenList = left.overall_state.tokenList.concat(right.overall_state.tokenList);
    n.overall_state.err = left.overall_state.err.concat(right.overall_state.err);
    const idTable = left.overall_state.idTable;
    right.overall_state.idTable.forEach((val, key) => {
        if (!idTable.has(key))
            idTable.set(key, val);
    });
    n.overall_state.idTable = idTable;
    return n;
}
function split_code(code) {
    const midpoint = Math.floor(code.length / 2);
    let left = midpoint;
    while (left > 0 && /[A-Za-z0-9_]/.test(code[left])) {
        left--;
    }
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
    return [code.slice(0, left), code.slice(left, code.length)];
}
