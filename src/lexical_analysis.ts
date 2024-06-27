import { find_lexeme } from './find_valid_lexeme';
import { lexical_analysis, token, run_state, wrap_run_state } from './types'

export {
  run_analysis,
  setNextStep,
}



function run_analysis(run_state: run_state): run_state {
  
  if(run_state.overall_state.index >= run_state.overall_state.code.length && !(run_state.current_state && run_state.running == 'regular')){
    if(run_state.running == 'string' || run_state.running == 'char') 
      run_state.overall_state.err.push(
        `at line ${run_state.overall_state.line}, character n ${run_state.overall_state.column}, unclosed quotations`
      );
      
    return run_state;
  }

  if(!run_state.next_step) return setNextStep(run_state, find_lexeme);

  return run_analysis(run_state.next_step(run_state));
}

function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state | undefined): run_state{
  run_state.next_step = next_step;
  return run_analysis(run_state);
}