/*
 * This file centralizes the handling of requests/responses
 */

import { is_char_part_of_lexeme } from "../lexical_analysis/find_lexeme";
import { run, setNextStep } from "../lexical_analysis/run_through_lexical_analysis";
import { tokenize } from "../lexical_analysis/tokenize";
import { lexeme, run_state, wrap_run_state } from "../lexical_analysis/types";
import { run_as_chunks } from "../utility/run_as_chunks";
import { formatLexicalAnalysis, join_lexemes, join_tokens, split_code } from "../utility/run_state_util";

export {
  getLexicalAnalysis
}

/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(buffer: string): Promise<{err?: string, result?: string[]}> {
  
  try{
    const lexemes = 
        run_as_chunks
        (
          wrap_run_state(buffer, (run_state: run_state) => run_state.parser.index >= run_state.parser.code.length || !run_state.next_step, is_char_part_of_lexeme), 
          buffer,
          (size) => size < 1000,
          run,
          join_lexemes,
          (thisField: run_state, buffer: string) => {thisField.parser.code = buffer; return thisField},
          split_code
        );
      
    lexemes.stop_condition = (run_state: run_state) => run_state.result.index >= run_state.parser.lexemes.length; 
    lexemes.next_step = tokenize;
    const result = 
        run_as_chunks
        (
          lexemes,
          lexemes.parser.lexemes,
          (size) => size < 1000,
          run,
          join_tokens,
          (thisField: run_state, buffer: lexeme[]) => {thisField.parser.lexemes = buffer; return thisField }
        )
    
    return { result: formatLexicalAnalysis(result.result.tokenList, result.result.idTable) };
  
    }catch(err){
    console.error(err);
    return { err: err } 
  }
  

}


