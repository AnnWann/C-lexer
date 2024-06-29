/*
 * This file centralizes the handling of requests/responses
 */

import { run_analysis } from "../lexical_analysis/run_through_lexical_analysis";
import { token, wrap_run_state } from "../lexical_analysis/types";

export {
  getLexicalAnalysis
}
/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(buffer: string): Promise<{err?: string, result?: string[]}> {
  
  const result = run_analysis(wrap_run_state(buffer));

  if(result.overall_state.err.length > 0) return { err: result.overall_state.err.reduce( (prev, curr) => prev + curr + '\n')}
  
  return { result: formatLexicalAnalysis(result.overall_state.tokenList, result.overall_state.idTable) };


}

/**
 * formats the tokenList and idTable into strings to be shown in the view.
 */
function formatLexicalAnalysis(tokenList: token[], idTable: Map<string, string>): string[]{

  const t = tokenList
    .map<string>( (token, i) => `${i}: type: ${token.type} value: ${token.value}`)
    .reduce((prev, curr) => prev + '\n' + curr + '\n');
  
  const i = Array.from(idTable.entries())
    .map<string>( ([key, value], i) => `${key}: ${value}`)
    .reduce( (prev, curr) => prev + '\n' +  curr + '\n');
  
  return [t, i];
}