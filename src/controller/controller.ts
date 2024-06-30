/*
 * This file centralizes the handling of requests/responses
 */

import { run_analysis } from "../lexical_analysis/run_through_lexical_analysis";
import { wrap_run_state } from "../lexical_analysis/types";
import { run_as_chunks } from "../utility/run_as_chunks";
import { formatLexicalAnalysis, join_run_state, split_code } from "../utility/run_state_util";

export {
  getLexicalAnalysis
}

/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(buffer: string): Promise<{err?: string, result?: string[]}> {
  
  const result = 
    await run_as_chunks
    (
      wrap_run_state(buffer), 
      buffer,
      (size) => size < 1000,
      run_analysis,
      join_run_state,
      split_code
    );

  if(result.lexemes.err.length > 0) return { err: result.lexemes.err.reduce( (prev, curr) => prev + curr + '\n')}
  
  return { result: formatLexicalAnalysis(result.lexemes.tokenList, result.lexemes.idTable) };

}


