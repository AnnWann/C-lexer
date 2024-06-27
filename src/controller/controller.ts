import { run_analysis } from "../lexical_analysis/lexical_analysis";
import { token, wrap_run_state } from "../lexical_analysis/types";
import * as fs from 'fs';
import { update_err, update_lexical_analysis_fields } from "../view/view";

/**
 * handles the lexicalAnalysis pipeline
 * @async
 */
async function getLexicalAnalysis(file: string) {
  
  fs.readFile(file, 'utf-8', (err, code) => {
    
    if(err) update_err(err.message);
    
    const result = run_analysis(wrap_run_state(code));

    if(result.overall_state.err.length > 0) update_err ( result.overall_state.err.reduce( (prev, curr) => prev + curr + '\n') );

    const [ tokenList, idTable ] = formatLexicalAnalysis(result.overall_state.tokenList, result.overall_state.idTable);
    
    update_lexical_analysis_fields(tokenList, idTable);
  });
  
}

/**
 * formats the tokenList and idTable into strings to be shown in the view.
 * @async
 */
function formatLexicalAnalysis(tokenList: token[], idTable: Map<string, string>): string[]{

  const t = tokenList
    .map<string>( (token, i) => `${i}: type: ${token.type} value: ${token.value}`)
    .reduce((prev, curr) => prev + curr + '\n');
  
  const i = Array.from(idTable.entries())
    .map<string>( ([key, value], i) => `${key}: ${value}`)
    .reduce( (prev, curr) => prev + curr + '\n');
  
  return [t, i];
}