import { regex_tokens } from './regexCodes';
import { createSHA256Hash } from './hash';

export {
  current_analysis,
  lexical_analysis,
  run_state,
  queue_analysis,
  run_analysis,
  setNextStep,
}

type token = {
  value: string,
  type: string,
};

type current_analysis = {
  lexeme: string,
  line: number,
  column: number,
  status: 'searching' | 'done',
}

type lexical_analysis = {
  tokenList: token[],
  idTable: Map<string, string>
  code: string, 
  index: number,
  line: number,
  column: number,
  status: 'done' | 'undone',
  err: string[],
}

type run_state = {
  overall_state: lexical_analysis,
  current_state: current_analysis | undefined,
  running: 'regular' | 'string' | 's_comment' | 'm_comment' | 'char',
  next_step: (run_state: run_state) => run_state | undefined,
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

function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state): run_state{
  return { 
    overall_state: run_state.overall_state, 
    current_state: run_state.current_state, 
    running: run_state.running, 
    next_step: next_step };
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



const x = Tokenize('hello world !!1');