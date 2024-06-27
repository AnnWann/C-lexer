"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrap_analysis = wrap_analysis;
exports.wrap_current_analysis = wrap_current_analysis;
exports.wrap_run_state = wrap_run_state;
const find_valid_lexeme_1 = require("./find_valid_lexeme");
function wrap_analysis(code) {
    return {
        tokenList: new Array(),
        idTable: new Map(),
        code: code, index: 0, line: 0,
        column: 0,
        err: new Array()
    };
}
function wrap_run_state(code) {
    const analysis = {
        tokenList: new Array(),
        idTable: new Map(),
        code: code,
        index: 0,
        line: 0,
        column: 0,
        err: new Array()
    };
    return {
        overall_state: analysis,
        current_state: undefined,
        running: 'regular',
        next_step: undefined
    };
}
function wrap_current_analysis(run_state) {
    const current_state = { lexeme: '',
        line: run_state.overall_state.line,
        column: run_state.overall_state.column,
    };
    return {
        overall_state: run_state.overall_state,
        current_state: current_state,
        running: run_state.running,
        next_step: find_valid_lexeme_1.find_lexeme
    };
}
