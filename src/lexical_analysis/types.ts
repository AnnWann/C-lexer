import { is_char_part_of_lexeme } from "./find_valid_lexeme";

export {
  token,
  current_analysis,
  lexical_analysis,
  run_state,
  wrap_current_analysis,
  wrap_run_state
}

type token = {
  value: string,
  type: string,
};

type current_analysis = {
  lexeme: string,
  line: number,
  column: number,
}

type lexical_analysis = {
  tokenList: token[],
  idTable: Map<string, string>
  code: string, 
  index: number,
  line: number,
  column: number,
  err: string[],
}

type run_state = {
  overall_state: lexical_analysis,
  current_state: current_analysis | undefined,
  running: 'default' | 'string' | 's_comment' | 'm_comment' | 'char',
  next_step: (run_state: run_state) => run_state | undefined,
}

function wrap_analysis(code: string): lexical_analysis{
  return { 
    tokenList: new Array<token>(), 
    idTable: new Map<string, string>(), 
    code: code, index: 0, line: 0, 
    column: 0, 
    err: new Array<string>() 
  }
}

function wrap_run_state(code: string): run_state{
  const analysis: lexical_analysis = { 
    tokenList: new Array<token>(), 
    idTable: new Map<string, string>(), 
    code: code, 
    index: 0, 
    line: 0, 
    column: 0, 
    err: new Array<string>() 
  }
  return {
    overall_state: analysis,
    current_state: undefined,
    running: 'default',
    next_step: undefined
  }
}

function wrap_current_analysis(run_state: run_state): run_state{
  
  const current_state: current_analysis = 
      { lexeme: '', 
        line: run_state.overall_state.line,
        column: run_state.overall_state.column,
      }

  return { 
    overall_state: run_state.overall_state, 
    current_state: current_state, 
    running: run_state.running, 
    next_step: is_char_part_of_lexeme 
  };
}