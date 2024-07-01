"use strict";
/*
 * This file is responsible with taking a lexeme and identifying its correct token as well as handle the symbol table
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
const run_through_lexical_analysis_1 = require("./run_through_lexical_analysis");
const regexCodes_1 = require("./regexCodes");
/**
 * reads a lexeme and adds its respective token to the token list
 */
function tokenize(run_state) {
    const lexeme = run_state.parser.lexemes[run_state.result.index];
    if (lexeme.literal) {
        const token = { value: lexeme.value, type: 'literal', start: lexeme.start, end: lexeme.end };
        run_state.result.tokenList.push(token);
        run_state.result.index += 1;
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, tokenize);
    }
    for (const [rule, name] of regexCodes_1.regex_tokens.entries()) {
        if (rule.test(lexeme.value)) {
            const token = (name === 'identifier') ? setId() : { value: lexeme.value, type: name, start: lexeme.start, end: lexeme.end };
            run_state.result.tokenList.push(token);
            run_state.result.index += 1;
            return (0, run_through_lexical_analysis_1.setNextStep)(run_state, tokenize);
        }
    }
    const token = { value: lexeme.value, type: 'ERROR', start: lexeme.start, end: lexeme.end };
    run_state.result.tokenList.push(token);
    run_state.result.index += 1;
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, tokenize);
    /**
     * builds an identifier token
     */
    function setId() {
        const lex_hash = createHash(lexeme.value).toString();
        if (!run_state.result.idTable.get(lex_hash))
            run_state.result.idTable.set(lex_hash, lexeme.value);
        return { value: lex_hash, type: 'identifier', start: lexeme.start, end: lexeme.end };
        /**
         * creates 16bit hash
         */
        function createHash(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const charCode = str.charCodeAt(i);
                hash = (hash << 8) ^ charCode;
            }
            return hash & 0xFFFF;
        }
    }
}
