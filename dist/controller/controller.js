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
        const run_state = (0, types_1.wrap_run_state)(buffer, (run_state) => run_state.parser.index >= run_state.parser.code.length, find_lexeme_1.is_char_part_of_lexeme);
        const chunkable_run_state = (0, run_as_chunks_1.wrap_as_chunkable)(run_state);
        const lexemes = await chunkable_run_state
            .set_operand(chunkable_run_state, (chunkable) => { chunkable.chunk = (0, run_through_lexical_analysis_1.run)(chunkable.chunk); return chunkable; })
            .set_join(chunkable_run_state, (chunkable, left, right) => { chunkable.chunk = (0, run_state_util_1.join_lexemes)(left, right); return chunkable; })
            .set_predicate(chunkable_run_state, (size) => size < 1000)
            .set_split(chunkable_run_state, run_state_util_1.split_code)
            .set_reconstruct(chunkable_run_state, (thisField, buffer) => { thisField.parser.code = buffer; return thisField; })
            .run_as_chunks(chunkable_run_state, buffer);
        lexemes.chunk.next_step = tokenize_1.tokenize;
        lexemes.chunk.stop_condition = (run_state) => run_state.result.index >= run_state.parser.lexemes.length;
        const result = await lexemes
            .set_join(lexemes, (chunkable, left, right) => { chunkable.chunk = (0, run_state_util_1.join_tokens)(left, right); return chunkable; })
            .set_reconstruct(lexemes, (thisField, buffer) => { thisField.parser.lexemes = buffer; return thisField; })
            .set_split(lexemes)
            .run_as_chunks(lexemes, lexemes.chunk.parser.lexemes);
        const tokenList = result.chunk.result.tokenList;
        const idTable = result.chunk.result.idTable;
        return { result: (0, run_state_util_1.formatLexicalAnalysis)(tokenList, idTable) };
    }
    catch (err) {
        console.error(err);
        return { err: err };
    }
}
