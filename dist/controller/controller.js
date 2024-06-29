"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLexicalAnalysis = getLexicalAnalysis;
const run_through_lexical_analysis_1 = require("../lexical_analysis/run_through_lexical_analysis");
const types_1 = require("../lexical_analysis/types");
/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(buffer) {
    const result = (0, run_through_lexical_analysis_1.run_analysis)((0, types_1.wrap_run_state)(buffer));
    if (result.overall_state.err.length > 0)
        return { err: result.overall_state.err.reduce((prev, curr) => prev + curr + '\n') };
    return { result: formatLexicalAnalysis(result.overall_state.tokenList, result.overall_state.idTable) };
}
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
