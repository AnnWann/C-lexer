import { is_char_part_of_lexeme } from './find_valid_lexeme';
import { run_state } from './types'

export {
  run_analysis,
  setNextStep,
}



function run_analysis(run_state: run_state): run_state {
  
  if(run_state.overall_state.index >= run_state.overall_state.code.length && !(run_state.current_state && run_state.running == 'default')){
    if(run_state.running == 'string' || run_state.running == 'char') 
      run_state.overall_state.err.push(
        `at line ${run_state.overall_state.line}, character n ${run_state.overall_state.column}, unclosed quotations`
      );
      
    return run_state;
  }

  if(!run_state.next_step) return setNextStep(run_state, is_char_part_of_lexeme);

  return run_analysis(run_state.next_step(run_state));
}

function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state | undefined): run_state{
  run_state.next_step = next_step;
  return run_analysis(run_state);
}