import { run_state, current_analysis, setNextStep } from "./lexical_analysis";

function find_lexeme(run_state: run_state): run_state | undefined {
  
  if(!run_state.current_state){
    return create_current_state(run_state);
  }
  
  const code = run_state.overall_state.code, index = run_state.overall_state.index;

  const curr_char = code[index];

  if(/[A-Za-z0-9]/.test(curr_char)){
    run_state.overall_state.index += 1;
    return setNextStep(run_state, find_lexeme);
  }

  
  
}
function create_current_state(run_state: run_state): run_state{
  
  const current_state: current_analysis = 
      { lexeme: '', 
        line: run_state.overall_state.line,
        column: run_state.overall_state.column,
        status: 'searching'
      }

  return { 
    overall_state: run_state.overall_state, 
    current_state: current_state, 
    running: run_state.running, 
    next_step: find_lexeme };
}