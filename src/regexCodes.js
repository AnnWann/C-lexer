/*
* ATTENTION!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
* ORDER OF TOKENS MATTER. DO NOT TOUCH AT ANY CIRCUMSTANCE, NO Fs GIVEN TO YOUR SENSE OF AESTHETIC. 
*/
const regex_tokens = new Map ([
  [/\bauto|break|case|char|const|continue|default|do|double|else|enum|extern|float|for|goto|if|int|long|register|return|short|signed|sizeof|static|struct|switch|typedef|union|unsigned|void|volatile|while\b/, 'keyword'],
  [/\"([^\\\"]|\\["\\bfnrt"\\])*\"/, 'string'],
  [/\'(.)\'/, 'char_literal'],
  [/^-?\d+(\.\d+)?([eE][+-]?\d+)?/, 'numeral'],
  [/->/, 'arrow'],
  [/\+=|\-=|\*=|\/=|%=|<<=|>>=|&=|\|=|\^=/, 'compound_assign'],
  [/<<|>>/, 'bitwise_shift'],
  [/==|!=|<=|>=|<|>/, 'comparison'],
  [/&&/, 'logical_and'],
  [/\+\+/, 'increment'],
  [/--/, 'decrement'],
  [/\|\|/, 'logical_or'],
  [/!/, 'deny'],
  [/\+/, 'add'],
  [/-/, 'subtract'],
  [/\*/, 'multiply_pointer'],
  [/\//, 'divide'],
  [/&/, 'bitwise_and'],
  [/\|/, 'bitwise_or'],
  [/\^/, 'bitwise_xor'],
  [/~/, 'bitwise_not'],
  [/=/, 'assign'],
  [/\./, 'dot'],
  [/\,/, 'comma'],
  [/\:/, 'colon'],
  [/\;/, 'semicolon'],
  [/\[/, 'brace_l'],
  [/\]/, 'brace_r'],
  [/\{/, 'bracket_l'],
  [/\}/, 'bracket_r'],
  [/\(/, 'parenthesis_l'],
  [/\)/, 'parenthesis_r'],
  [/[a-zA-Z_][a-zA-Z0-9_]*/, 'identifier'],
]);

const regex_stopping_signs = new Map ([
  [/\s/, 'empty space'],
  [/[A-Za-z_0-9_.]/, 'letters and numbers'],
  [/"/, 'double quote'],
  [/'/, 'single quote'],
  [/\b\/\*\b/, 'm_comment_s'],
  [/\b\*\b/, 'm_comment_e'],
  [/\b\/\/\b/, 's_comment'],
  [/\n/, 'line_b'],
  [/=|!|<|>|\+|-|\*|\/|\||&|%|\^/, 'operators'],
  [/\{|\}|\(|\)|\[|\]|;|.|,|:/, 'punctuation'],
  
]);

module.exports = {
  regex_tokens,
  regex_stopping_signs,
}
