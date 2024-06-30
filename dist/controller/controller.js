"use strict";
/*
 * This file centralizes the handling of requests/responses
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.getLexicalAnalysis = getLexicalAnalysis;
const find_lexeme_1 = require("../lexical_analysis/find_lexeme");
const run_through_lexical_analysis_1 = require("../lexical_analysis/run_through_lexical_analysis");
const tokenize_1 = require("../lexical_analysis/tokenize");
const types_1 = require("../lexical_analysis/types");
const run_as_chunks_1 = require("../utility/run_as_chunks");
const run_state_util_1 = require("../utility/run_state_util");
/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(buffer) {
    try {
        const lexemes = (0, run_as_chunks_1.run_as_chunks)((0, types_1.wrap_run_state)(buffer, (run_state) => run_state.parser.index >= run_state.parser.code.length || !run_state.next_step, find_lexeme_1.is_char_part_of_lexeme), buffer, (size) => size < 1000, run_through_lexical_analysis_1.run, run_state_util_1.join_lexemes, (thisField, buffer) => { thisField.parser.code = buffer; return thisField; }, run_state_util_1.split_code);
        lexemes.stop_condition = (run_state) => run_state.result.index >= run_state.parser.lexemes.length;
        lexemes.next_step = tokenize_1.tokenize;
        const result = (0, run_as_chunks_1.run_as_chunks)(lexemes, lexemes.parser.lexemes, (size) => size < 1000, run_through_lexical_analysis_1.run, run_state_util_1.join_tokens, (thisField, buffer) => { thisField.parser.lexemes = buffer; return thisField; });
        return { result: (0, run_state_util_1.formatLexicalAnalysis)(result.result.tokenList, result.result.idTable) };
    }
    catch (err) {
        console.error(err);
        return { err: err };
    }
}
