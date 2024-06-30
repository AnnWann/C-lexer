/*
 * This file defines the base types and has constructors used in this project
 */

import { is_char_part_of_lexeme } from "./find_lexeme";
import { run, setNextStep } from "./run_through_lexical_analysis";

export {
  token,
  lexeme,
  lexical_result,
  run_state,
  wrap_current_lexeme,
  wrap_run_state
}

type token = {
  value: string,
  type: string
  start: { line: number, column: number}
  end: { line: number, column: number}
};

type lexeme = {
  value: string,
  start: { line: number, column: number},
  end: { line: number, column: number},
  literal?: boolean
}

type lexical_parser = {
  lexemes: lexeme[],
  code: string, 
  index: number,
  position: { line: number, column: number}
  current_lexeme?: lexeme,
}

type lexical_result = {
  tokenList: token[],
  idTable: Map<string, string>,
  index: number
}

type run_state = {
  result: lexical_result;
  parser: lexical_parser,
  running: 'default' | 'string' | 's_comment' | 'm_comment',
  stop_condition: (run_state: run_state) => boolean,
  next_step?: (run_state: run_state) => run_state,
}

function wrap_current_lexeme(run_state: run_state): run_state{
  run_state.parser.current_lexeme = {
    value: '',
    start: run_state.parser.position,
    end: run_state.parser.position
  }
  return setNextStep(run_state, is_char_part_of_lexeme);
}

function wrap_lexical_parser(code: string): lexical_parser{
  return {
    lexemes: new Array<lexeme>(),
    code: code, 
    index: 0,
    position: { line: 0, column: 0}
  }
}

function wrap_lexical_result(): lexical_result{
  return { 
    tokenList: new Array<token>(), 
    idTable: new Map<string, string>(), 
    index: 0,
  }
}

function wrap_run_state(code: string, stop_condition?: (run_state: run_state) => boolean, next_step?: (run_state: run_state) => run_state): run_state{
  const parser: lexical_parser = wrap_lexical_parser(code);
  return {
    result: wrap_lexical_result(),
    parser: parser,
    running: 'default',
    stop_condition,
    next_step,
  }
}

