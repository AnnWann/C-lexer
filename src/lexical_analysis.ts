import { regex_tokens } from './regexCodes';
import { createSHA256Hash } from './hash';

export {
  current_analysis,
  lexical_analysis,
  run_state,
  queue_analysis,
  run_analysis,
  setNextStep,
}

type token = {
  value: string,
  type: string,
};

type current_analysis = {
  lexeme: string,
  line: number,
  column: number,
  status: 'searching' | 'done',
}

type lexical_analysis = {
  tokenList: token[],
  idTable: Map<string, string>
  code: string, 
  index: number,
  line: number,
  column: number,
  status: 'done' | 'undone',
  err: string[],
}

type run_state = {
  overall_state: lexical_analysis,
  current_state: current_analysis | undefined,
  running: 'regular' | 'string' | 's_comment' | 'm_comment' | 'char',
  next_step: (run_state: run_state) => run_state | undefined,
}

function queue_analysis(code: string): lexical_analysis{
  return { 
    tokenList: new Array<token>(), 
    idTable: new Map<string, string>(), 
    code: code, index: 0, line: 0, 
    column: 0, 
    status: 'undone', 
    err: new Array<string>() 
  }
}

function setNextStep(run_state: run_state, next_step: (run_state: run_state) => run_state): run_state{
  return { 
    overall_state: run_state.overall_state, 
    current_state: run_state.current_state, 
    running: run_state.running, 
    next_step: next_step };
}

function run_analysis(run_state: run_state): run_state {
  
  if(run_state.overall_state.index >= run_state.overall_state.code.length){
    if(run_state.running == 'string' || run_state.running == 'char') 
      run_state.overall_state.err.push(
        `at line ${run_state.overall_state.line}, character n ${run_state.overall_state.column}, unclosed quotations`
      );
    run_state.overall_state.status = 'done';
    return run_state;
  }

  if(run_state.next_step) return run_analysis(run_state.next_step(run_state));
}

function Tokenize(file: string): lexical_analysis{

  const L_analysis: lexical_analysis = { tokenList: new Array<token>(), idTable: new Map<string, string>(), file: file, status: 'undone', err: new Array<string>()};
  const current_analysis: current_analysis = { lexeme: "", line: 0, char_in_line: 0, running: 'regular'}
  const length = file.length;
  return findLexeme(file, 0);

  function findLexeme(file: string, i: number){
    
    if(i >= length){
      if(current_analysis.running == 'string' || current_analysis.running == 'char') L_analysis.err.push(`at line ${current_analysis.line}, unclosed quotation`);
      return L_analysis;
    }

    

    current_analysis.running = getRunning(curr_char);
  
    switch(L_analysis.running){
      
      case 'string': 
        if(curr_char == `"`) {
          L_analysis.tokenList.push(getToken(lexeme + curr_char));
          lexeme = '';
          L_analysis.running = 'regular';
          return findLexeme(file, i + 1, lexeme, line);
        }
      
      case 'char':
        if(curr_char == `'`) {
          lexeme += curr_char;
          L_analysis.tokenList.push(getToken(lexeme));
          if(lexeme.length > 3) L_analysis.err.push(`at line ${line}, improper usage of single quotes ('), char literals shouldn't be longer than 1 character.`);
          lexeme = '';
          L_analysis.running = 'regular';
          return findLexeme(file, i + 1, lexeme, line);
        }

      case 's_comment': 
        if(curr_char == '\n')
          return findLexeme(file, i + 1, '', line);
      
      case 'm_comment': 
        if(curr_char == '*'){
          const curr_and_next = curr_char + file[i];
          if(curr_and_next == "*/")
            return findLexeme(file, i + 1, '', line);
        }
      
      default: 
        if(curr_char == ' ' || curr_char == '\n') return findLexeme(file, i + 1, lexeme, line);
        L_analysis.tokenList.push(getToken(lexeme));
        return findLexeme(file, i, '', line);
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

    function getRunning(curr_char: string): 'regular' | 'string' | 's_comment' | 'm_comment' | 'char'{
      switch(curr_char){
        case '\"': 
          return 'string';
        case '\'':
          return 'char';
        case '/':
          const capture = file[i+1];
          if(capture == '/') return 's_comment';
          if(capture == '*') return 'm_comment';
          return 'regular';
        default: 
          return 'regular';
      }
    }
  }

}


const x = Tokenize('hello world !!1');