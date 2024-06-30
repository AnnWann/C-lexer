"use strict";
/*
 * This file centralizes the handling of requests/responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLexicalAnalysis = getLexicalAnalysis;
const run_through_lexical_analysis_1 = require("../lexical_analysis/run_through_lexical_analysis");
const types_1 = require("../lexical_analysis/types");
const run_as_chunks_1 = require("../utility/run_as_chunks");
const run_state_util_1 = require("../utility/run_state_util");
/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(buffer) {
    const result = await (0, run_as_chunks_1.run_as_chunks)((0, types_1.wrap_run_state)(buffer), buffer, (size) => size < 1000, run_through_lexical_analysis_1.run_analysis, run_state_util_1.join_run_state, run_state_util_1.split_code);
    if (result.overall_state.err.length > 0)
        return { err: result.overall_state.err.reduce((prev, curr) => prev + curr + '\n') };
    return { result: (0, run_state_util_1.formatLexicalAnalysis)(result.overall_state.tokenList, result.overall_state.idTable) };
}
