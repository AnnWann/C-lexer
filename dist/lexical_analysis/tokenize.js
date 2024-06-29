"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
const run_through_lexical_analysis_1 = require("./run_through_lexical_analysis");
const regexCodes_1 = require("./regexCodes");
/**
 * reads a lexeme and adds its respective token to the token list
 */
function tokenize(run_state) {
    const lexeme = run_state.current_state.lexeme;
    for (const [rule, name] of regexCodes_1.regex_tokens.entries()) {
        if (rule.test(lexeme)) {
            const token = name == 'identifier' ? setId() : { value: lexeme, type: name };
            run_state.overall_state.tokenList.push(token);
            run_state.current_state = undefined;
            return (0, run_through_lexical_analysis_1.setNextStep)(run_state, undefined);
        }
    }
    run_state.overall_state.err.push(`at ${run_state.current_state.line}, ${run_state.current_state.column}: Couldn't find a definition for ${lexeme}`);
    const token = { value: lexeme, type: 'ERROR' };
    run_state.overall_state.tokenList.push(token);
    run_state.current_state = undefined;
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, undefined);
    /**
     * builds an identifier token
     */
    function setId() {
        const lex_hash = createHash(lexeme).toString();
        if (!run_state.overall_state.idTable.get(lex_hash))
            run_state.overall_state.idTable.set(lex_hash, lexeme);
        return { value: lex_hash, type: 'identifier' };
    }
}
/**
 * creates SHA256 hash
 */
function createHash(str) {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
        const charCode = str.charCodeAt(i);
        hash = (hash << 8) ^ charCode;
    }
    return hash & 0xFFFF;
}
