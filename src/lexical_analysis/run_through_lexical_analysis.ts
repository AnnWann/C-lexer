/*
 * This file takes a run:state and runs through it until EOF
 */

import { run_state } from './types'

export {
  run_analysis,
  setNextStep,
}


/**
 * iterates through the code, applying the next step to the lexical analysis until the end of file
 */
function run_analysis(run_state: run_state): run_state {
  
  if(run_state.lexemes.index >= run_state.lexemes.code.length)
    return run_state;

  if(!run_state.next_step)

  return run_analysis(run_state.next_step(run_state));
}

/**
 * injects run_analysis with the next step
 */
function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state): run_state{
  run_state.next_step = next_step;
  return run_analysis(run_state);
}