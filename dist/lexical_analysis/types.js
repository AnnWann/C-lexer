"use strict";
/*
 * This file defines the base types and has constructors used in this project
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap_current_lexeme = wrap_current_lexeme;
exports.wrap_run_state = wrap_run_state;
const find_lexeme_1 = require("./find_lexeme");
const run_through_lexical_analysis_1 = require("./run_through_lexical_analysis");
function wrap_current_lexeme(run_state) {
    run_state.parser.current_lexeme = {
        value: '',
        start: run_state.parser.position,
        end: run_state.parser.position
    };
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, find_lexeme_1.is_char_part_of_lexeme);
}
function wrap_lexical_parser(code) {
    return {
        lexemes: new Array(),
        code: code,
        index: 0,
        position: { line: 0, column: 0 }
    };
}
function wrap_lexical_result() {
    return {
        tokenList: new Array(),
        idTable: new Map(),
        index: 0,
    };
}
function wrap_run_state(code, stop_condition, next_step) {
    const parser = wrap_lexical_parser(code);
    return {
        result: wrap_lexical_result(),
        parser: parser,
        running: 'default',
        stop_condition,
        next_step,
    };
}
