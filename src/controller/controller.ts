/*
 * This file centralizes the handling of requests/responses
 */

import { is_char_part_of_lexeme } from "../lexical_analysis/find_lexeme";
import { run, setNextStep } from "../lexical_analysis/run_through_lexical_analysis";
import { tokenize } from "../lexical_analysis/tokenize";
import { lexeme, run_state, wrap_run_state } from "../lexical_analysis/types";
import { chunkable, run_as_chunks, wrap_as_chunkable } from "../utility/run_as_chunks";
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
   
    const run_state: run_state = wrap_run_state(buffer, (run_state: run_state) => run_state.parser.index >= run_state.parser.code.length, is_char_part_of_lexeme);
    const chunkable_run_state: chunkable<run_state, string | lexeme[]> = wrap_as_chunkable<run_state, string | lexeme[]>(run_state);
    
    const lexemes: chunkable<run_state, string | lexeme[]> = await chunkable_run_state
      .set_operand(chunkable_run_state, (chunkable: chunkable<run_state, string | lexeme[]>) => 
        { chunkable.chunk = run(chunkable.chunk); return chunkable })
      .set_join(chunkable_run_state, (chunkable: chunkable<run_state, string | lexeme[]>, left: run_state, right: run_state) => 
        { chunkable.chunk = join_lexemes(left, right); return chunkable })
      .set_predicate(chunkable_run_state, (size: number) => size < 1000)
      .set_split(chunkable_run_state, split_code)
      .set_reconstruct(chunkable_run_state, (thisField: run_state, buffer: string) => { thisField.parser.code = buffer; return thisField })
      .run_as_chunks(chunkable_run_state, buffer);
    
    lexemes.chunk.next_step = tokenize;
    lexemes.chunk.stop_condition = (run_state: run_state) => run_state.result.index >= run_state.parser.lexemes.length;

    const result = await lexemes
      .set_join(lexemes, (chunkable: chunkable<run_state, string | lexeme[]>, left: run_state, right: run_state) => 
        { chunkable.chunk = join_tokens(left, right); return chunkable})
      .set_reconstruct(lexemes, (thisField: run_state, buffer: lexeme[]) => {thisField.parser.lexemes = buffer; return thisField })
      .set_split(lexemes)
      .run_as_chunks(lexemes, lexemes.chunk.parser.lexemes);
    
    const tokenList = result.chunk.result.tokenList;
    const idTable = result.chunk.result.idTable;
    
    return { result: formatLexicalAnalysis(tokenList, idTable) };
  
    }catch(err){
    console.error(err);
    return { err: err } 
  }
  

}


