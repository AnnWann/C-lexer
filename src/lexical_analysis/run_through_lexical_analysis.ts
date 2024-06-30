/*
 * This file takes a run:state and runs through it until EOF
 */

import { is_char_part_of_lexeme } from './find_lexeme';
import { run_state, wrap_run_state } from './types'

export {
  run,
  setNextStep,
}


/**
 * iterates through the code, applying the next step to the lexical analysis until the end of file
 */
function run(run_state: run_state): run_state {
  
  if(run_state.stop_condition(run_state))
    return run_state;
  
  return run(run_state.next_step(run_state));
}

/**
 * injects run_analysis with the next step
 */
function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state): run_state{
  run_state.next_step = next_step;
  return run(run_state);
}