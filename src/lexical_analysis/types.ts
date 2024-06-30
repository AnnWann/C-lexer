/*
 * This file defines the base types and has constructors used in this project
 */

import { is_char_part_of_lexeme } from "./find_lexeme";

export {
  token,
  current_lexeme as current_analysis,
  lexical_result as lexical_analysis,
  run_state,
  wrap_current_analysis,
  wrap_run_state
}

type token = {
  value: string,
  type: string,
  line: number,
  column: number,
};

type current_lexeme = {
  lexeme: string,
  line: number,
  column: number,
}

type lexical_parser = {
  lexemes: string[],
  code: string, 
  index: number,
  line: number,
  column: number,
}

type lexical_result = {
  tokenList: token[],
  idTable: Map<string, string>,
  current_lexeme?: current_lexeme,
}
type run_state = {
  result?: lexical_result;
  lexemes: lexical_parser,
  running: 'default' | 'string' | 's_comment' | 'm_comment' | 'char',
  next_step?: (run_state: run_state) => run_state,
}

function wrap_lexical_parser(code: string): lexical_parser{
  return {
    lexemes: new Array<string>(),
    code: code, 
    index: 0,
    line: 0,
    column: 0,
  }
}

function wrap_lexical_result(): lexical_result{
  return { 
    tokenList: new Array<token>(), 
    idTable: new Map<string, string>(), 
    current_lexeme: undefined
  }
}

function wrap_run_state(code: string): run_state{
  const parser: lexical_parser = wrap_lexical_parser(code);
  return {
    result: undefined,
    lexemes: parser,
    running: 'default',
  }
}

function wrap_current_analysis(run_state: run_state): run_state{
  return { 
    lexemes: run_state.lexemes, 
    running: run_state.running, 
    next_step: is_char_part_of_lexeme 
  };
}