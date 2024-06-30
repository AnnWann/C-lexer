/*
 * This file is responsible with taking a lexeme and identifying its correct token as well as handle the symbol table
 */


import { setNextStep } from "./run_through_lexical_analysis";
import { regex_tokens } from "./regexCodes";
import { token, run_state } from "./types";

export {
  tokenize,
}

/**
 * reads a lexeme and adds its respective token to the token list
 */
function tokenize(run_state: run_state): run_state {
  
  const lexeme = run_state.current_state.lexeme;

  for(const [rule, name] of regex_tokens.entries()){
    if(rule.test(lexeme)){
      const token: token = name == 'identifier' ? setId() : { value: lexeme, type: name };
      run_state.lexemes.tokenList.push(token);
      run_state.current_state = undefined;
      return setNextStep(run_state, undefined);
    } 
  }

  run_state.lexemes.err.push(`at ${run_state.current_state.line}, ${run_state.current_state.column}: Couldn't find a definition for ${lexeme}`);
  const token = { value: lexeme, type: 'ERROR' };
  run_state.lexemes.tokenList.push(token);
  run_state.current_state = undefined;
  return setNextStep(run_state, undefined);

/**
 * builds an identifier token 
 */
  function setId(): token{
    const lex_hash = createHash(lexeme).toString();
    if(!run_state.lexemes.idTable.get(lex_hash)) run_state.lexemes.idTable.set(lex_hash, lexeme);
    return { value: lex_hash, type: 'identifier' };
    
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