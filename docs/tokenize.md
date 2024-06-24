# tokenize.js

This file contains all the functions that perform the lexical analysis.

---

> ## Usage
> This file only exports the function tokenize and the constant idTable. Here are the instructions to use this file.
>> ` const code = "char* code = "this is C code";"; `  
>> ` const tokens = tokenize(code); `  
>> ` console.log("ID TABLE:\n"); `
>> ` for(token at Tokens){ `
>>  ` console.log("value: " + token.value + " type :" + token.type + "\n"); `
>> `} `
>> ` console.log("ID TABLE:\n"); `
>>` idTable.forEach((key, value) => console.log("key: " + key + " value: " + value)); `
>
> *DO NOT:*
>> ` idTable.forEach( /* do something here */ ); ` 
>> ` const token = tokenize(code) // use idTable before using tokenize `
>> it won't break but you'll use an empty map.
>

> ## Elements
> 1. regex_tokens
>
>> *CONST VARIABLE*
>> Use: contains all the valid regular expressions (regex) of the C language paired its related type of token. 
>> Type: Map <<RegExp>, string> 
>
> 2. regex_stopping_signs
>> *CONST VARIABLE*
>> Use: contains all the regular expressions for lexeme limit of the C language paired its name. 
>> Type: Map <<RegExp>, string>
>
> 3. createSHA256Hash (inputString)
>> see definition at 
>
> 4. idTable
>> *CONST VARIABLE*
>> Use: contains all identifiers found at the source code. 
>> Type: Map <<number, string>>
>
> 5. tokenize (code)
>> *FUNCTION*
>> Gets a list of all tokens in a given text
>>> Receives: 
>>> - code: source code / string
>>> Returns: { value: string, type: string | undefined }[]
>
> 6. getLexeme (i, code, regex)
>> *FUNCTION*
>> Builds a lexeme from text according to a given rule and returns its value and size
>>> Receives: 
>>> - i: current index / number
>>> - code: source code / string
>>> - regex rule to build valid lexeme with
>>> Returns: { value: string, size: number }
>
> 7. buildCompoundLexeme (i, code, predicate, regex_name)
>> *FUNCTION*
>> Helps getLexeme to handle the specific cases where a lexeme is composed of more than a single character
>>> Receives: 
>>> - i: current index / number
>>> - code: source code / string
>>> - predicate: condition to find the end of the lexeme / function(string)
>>> - regex_name: name of the regex currently tested / RegExp
>>> Returns: { value: string, size: number }
>
> 8. getEndOfLexeme (i, code, predicate)
>> *FUNCTION*
>> Helps buildCompoundLexeme to find the index where the lexeme ends
>>> Receives: 
>>> - i: current index / number
>>> - code: source code / string
>>> - predicate: condition to find the end of the lexeme / function(string)
>>> Returns: number
>
> 9. makeToken (lex : string)
>> *FUNCTION*
>> Assigns a regEx from the C language to a lexeme
>>> Receives: 
>>> - lex: lexeme
>>> Returns: { value: string, type: string | undefined }
>
> 10. getId (lex : string)
>> *FUNCTION*
>> Checks if an Id already exists in *idTable* and returns it, else creates it and then returns it.
>>> Receives: 
>>> - lex: lexeme
>>> Returns: { value: string, type: string | undefined }
>
> 11. getKeyByValue ( map: Map<<any,any>>, value: any)
>> *FUNCTION*
>> gets key from value
>>> Receives: 
>>> - map: map to return key from
>>> - value: value to find respective key
>>> Returns: any | undefined
>
