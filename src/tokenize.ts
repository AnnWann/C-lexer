import { run_state } from "./lexical_analysis";

export {
  tokenize,
}

function tokenize(run_state: run_state): run_state {
  
}

function getToken(lex: string): token{
  for(const [rule, name] of regex_tokens.entries()){
    if(rule.test(lex)){
      return name == 'identifier' ? setId(lex) : { value: lex, type: name }; 
    }
}
  return { value: lex, type: 'ERROR' };

  function setId(lex: string){
    const lex_hash = createSHA256Hash(lex);
    if(!L_analysis.idTable.get(lex_hash)) L_analysis.idTable.set(lex_hash, lex);
    return { value: lex_hash, type: 'identifier' }; 
  }
}