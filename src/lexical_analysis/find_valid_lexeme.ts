import { setNextStep } from "./lexical_analysis";
import { tokenize } from "./tokenize";
import { run_state, wrap_current_analysis } from "./types";

export {
  is_char_part_of_lexeme,
}

/**
 * verify if char being currently analysed is part of a valid lexeme
 */
function is_char_part_of_lexeme(run_state: run_state): run_state {
  
  const code = run_state.overall_state.code, index = run_state.overall_state.index;

  const curr_char = code[index];

  if((curr_char == ' ' || curr_char == '\n') && run_state.running == 'default') return setNextStep(run_state, sanitize_escape);

  if(!run_state.current_state) return setNextStep(run_state, wrap_current_analysis);
  
  if(/[A-Za-z0-9]/.test(curr_char)){
    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    return setNextStep(run_state, is_char_part_of_lexeme);
  }

  const running = run_state.running;
  
  if(running == 'string') setNextStep(run_state, sanitize_string);

  if(running == 'char') setNextStep(run_state, sanitize_char);

  if(running == 'm_comment' || running == 's_comment') setNextStep(run_state, sanitize_comment);
  
  return setNextStep(run_state, sanitize_default);
}

/**
 * handles the case in which the current char is a stop sign and the analysis is in default mode
 */
function sanitize_default(run_state: run_state): run_state {
  
  const curr_char = run_state.overall_state.code[run_state.overall_state.index], next_char = run_state.overall_state.code[run_state.overall_state.index + 1];

  if(curr_char == '\"'){

    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    run_state.current_state.column += 1;
    run_state.running = 'string';

    return setNextStep(run_state, is_char_part_of_lexeme);
  }

  if(curr_char == '\''){

    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    run_state.current_state.column += 1;
    run_state.running = 'char';

    return setNextStep(run_state, is_char_part_of_lexeme);
  }

  if(curr_char == '/' && next_char == '/'){
    
    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    run_state.current_state.column += 1;
    run_state.running = 's_comment';

    return setNextStep(run_state, is_char_part_of_lexeme);
  }

  if(curr_char == '/' && next_char == '/*'){
    
    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    run_state.current_state.column += 1;
    run_state.running = 'm_comment';

    return setNextStep(run_state, is_char_part_of_lexeme);
  }

  if(/\{|\}|\(|\)|\[|\]|;|.|,|:/.test(curr_char)) return setNextStep(run_state, handle_ponctuation);

  return setNextStep(run_state, handle_operators);
}

/**
 * handles the case in which the current char is a stop sign and the analysis is in string mode
 */
function sanitize_string(run_state: run_state): run_state {
  
  const curr_char = run_state.overall_state.code[run_state.overall_state.index];
 
  if(curr_char == '\"') {

    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    run_state.current_state.column += 1;
    run_state.running = 'default';

    return setNextStep(run_state, tokenize);
  }
}

/**
 * handles the case in which the current char is a stop sign and the analysis is in char mode
 */
function sanitize_char(run_state: run_state): run_state {
  
  const curr_char = run_state.overall_state.code[run_state.overall_state.index];

  if(curr_char == '\'') {
    run_state.current_state.lexeme += curr_char;
    run_state.overall_state.index += 1;
    run_state.running = 'default';

    if(run_state.current_state.lexeme.length > 3) 
      run_state.overall_state.err.push(
              `at ${run_state.current_state.line}, ${run_state.current_state.column}. 
              Improper usage of single quotes ('), char literals shouldn't be longer than 1 character`
    );

    return setNextStep(run_state, tokenize);
  }

}

/**
 * handles the case in which the current char is a stop sign and the analysis is in s_comment or m_comment mode
 */
function sanitize_comment(run_state: run_state): run_state {

  const code = run_state.overall_state.code, index = run_state.overall_state.index, curr_char = code[index];

  const hasEnded = 
    (run_state.running == 's_comment' && curr_char == '\n') || 
    (run_state.running == 'm_comment' && curr_char == '*' && code[index + 1] == '/');
  
    
    if(hasEnded){
      run_state.overall_state.index += run_state.running == "m_comment" ? 2 : 1;
      run_state.overall_state.line += run_state.current_state.line;
      run_state.overall_state.column = 0;
      run_state.current_state = undefined;
      run_state.running = 'default'
      
      return setNextStep(run_state, is_char_part_of_lexeme);
    }
}

/**
 * handles the case in which the current char is a espace sign and the analysis is in default mode
 */
function sanitize_escape(run_state: run_state): run_state {

  const curr_char = run_state.overall_state.code[run_state.overall_state.index];

  run_state.overall_state.index += 1;
  run_state.overall_state.line += curr_char == '\n' ? run_state.current_state?.line : 0;
  
  if(!run_state.current_state){
    return setNextStep(run_state, is_char_part_of_lexeme);
  }
  
  run_state.overall_state.column += run_state.current_state.column;
  return setNextStep(run_state, tokenize);
}

/**
 * handles the case in which the current char is a ponctuation sign and the analysis is in default mode
 */
function handle_ponctuation(run_state: run_state): run_state {

  const curr_char = run_state.overall_state.code[run_state.overall_state.index];

  if(run_state.current_state.lexeme.length > 0){
    run_state.overall_state.column = run_state.current_state.column;
    return setNextStep(run_state, tokenize);
  }

  run_state.current_state.lexeme += curr_char;
  run_state.overall_state.index += 1;
  run_state.current_state.column += run_state.current_state.column;
  return setNextStep(run_state, tokenize);
}
/**
 * handles the case in which the current char is an operator sign and the analysis is in default mode
 */
function handle_operators(run_state: run_state): run_state{

  if(run_state.current_state.lexeme.length > 0){
    run_state.overall_state.column = run_state.current_state.column;
    return setNextStep(run_state, tokenize);
  }

  const code = run_state.overall_state.code;

  let i = 0, operator = "";

  for(; i < 3; i++){
    const curr_index = run_state.overall_state.index + i;
    if(!/=|!|<|>|\+|-|\*|\/|\||&|%|\^/.test(code[curr_index]))
      break;
    operator += code[curr_index];
  }

  run_state.current_state.lexeme += operator;
  run_state.overall_state.index += i;
  run_state.current_state.column += i;
  return setNextStep(run_state, tokenize);
    
}