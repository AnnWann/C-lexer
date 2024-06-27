"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenize = tokenize;
const crypto_1 = require("crypto");
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
        const lex_hash = createSHA256Hash(lexeme);
        if (!run_state.overall_state.idTable.get(lex_hash))
            run_state.overall_state.idTable.set(lex_hash, lexeme);
        return { value: lex_hash, type: 'identifier' };
    }
}
/**
 * creates SHA256 hash
 */
function createSHA256Hash(inputString) {
    const hash = (0, crypto_1.createHash)('sha256');
    hash.update(inputString);
    return hash.digest('hex');
}
