/*
 * This file is responsible with taking a lexeme and identifying its correct token as well as handle the symbol table
 */


import { run, setNextStep } from "./run_through_lexical_analysis";
import { regex_tokens } from "./regexCodes";
import { token, run_state } from "./types";

export {
  tokenize,
}

/**
 * reads a lexeme and adds its respective token to the token list
 */
function tokenize(run_state: run_state): run_state {
  
  const lexeme = run_state.parser.lexemes[run_state.result.index];

  if(lexeme.literal){
    const token: token = { value: lexeme.value, type: 'literal', start: lexeme.start, end: lexeme.end };
    run_state.result.tokenList.push(token);
    run_state.result.index += 1;
    return setNextStep(run_state, tokenize);
  }
  for(const [rule, name] of regex_tokens.entries()){
    if(rule.test(lexeme.value)){
      const token: token = (name === 'identifier') ? setId() : { value: lexeme.value, type: name, start: lexeme.start, end: lexeme.end};
      run_state.result.tokenList.push(token);
      run_state.result.index += 1;
      return setNextStep(run_state, tokenize);
    } 
  }

  const token: token = { value: lexeme.value, type: 'ERROR', start: lexeme.start, end: lexeme.end };
  run_state.result.tokenList.push(token);
  run_state.result.index += 1;
  return setNextStep(run_state, tokenize);

/**
 * builds an identifier token 
 */
  function setId(): token{
    const lex_hash = createHash(lexeme.value).toString();
    if(!run_state.result.idTable.get(lex_hash)) run_state.result.idTable.set(lex_hash, lexeme.value);
    return { value: lex_hash, type: 'identifier', start: lexeme.start, end: lexeme.end };
    
  /**
   * creates 16bit hash 
   */
  function createHash(str: string): number {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      const charCode = str.charCodeAt(i);
      hash = (hash << 8) ^ charCode; 
    }
    return hash & 0xFFFF;
    }
  }
}