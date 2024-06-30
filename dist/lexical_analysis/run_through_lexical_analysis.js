"use strict";
/*
 * This file takes a run:state and runs through it until EOF
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.run = run;
exports.setNextStep = setNextStep;
/**
 * iterates through the code, applying the next step to the lexical analysis until the end of file
 */
function run(run_state) {
    if (run_state.stop_condition(run_state))
        return run_state;
    return run(run_state.next_step(run_state));
}
/**
 * injects run_analysis with the next step
 */
function setNextStep(run_state, next_step) {
    run_state.next_step = next_step;
    return run(run_state);
}
