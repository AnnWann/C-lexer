"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_analysis = run_analysis;
exports.setNextStep = setNextStep;
const find_lexeme_1 = require("./find_lexeme");
/**
 * iterates through the code, applying the next step to the lexical analysis until the end of file
 */
function run_analysis(run_state) {
    if (run_state.overall_state.index >= run_state.overall_state.code.length && !(run_state.current_state && run_state.running == 'default')) {
        if (run_state.running == 'string' || run_state.running == 'char')
            run_state.overall_state.err.push(`at line ${run_state.overall_state.line}, character n ${run_state.overall_state.column}, unclosed quotations`);
        return run_state;
    }
    if (!run_state.next_step)
        return setNextStep(run_state, find_lexeme_1.is_char_part_of_lexeme);
    return run_analysis(run_state.next_step(run_state));
}
/**
 * injects run_analysis with the next step
 */
function setNextStep(run_state, next_step) {
    run_state.next_step = next_step;
    return run_analysis(run_state);
}
