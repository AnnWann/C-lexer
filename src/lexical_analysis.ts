import { lexical_analysis, token, run_state } from './types'

export {
  queue_analysis,
  run_analysis,
  setNextStep,
}

function queue_analysis(code: string): lexical_analysis{
  return { 
    tokenList: new Array<token>(), 
    idTable: new Map<string, string>(), 
    code: code, index: 0, line: 0, 
    column: 0, 
    status: 'undone', 
    err: new Array<string>() 
  }
}



function run_analysis(run_state: run_state): run_state {
  
  if(run_state.overall_state.index >= run_state.overall_state.code.length){
    if(run_state.running == 'string' || run_state.running == 'char') 
      run_state.overall_state.err.push(
        `at line ${run_state.overall_state.line}, character n ${run_state.overall_state.column}, unclosed quotations`
      );
    run_state.overall_state.status = 'done';
    return run_state;
  }

  if(run_state.next_step) return run_analysis(run_state.next_step(run_state));
}

function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state): run_state{
  return { 
    overall_state: run_state.overall_state, 
    current_state: run_state.current_state, 
    running: run_state.running, 
    next_step: next_step };
}