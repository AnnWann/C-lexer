"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.find_lexeme = find_lexeme;
const lexical_analysis_1 = require("./lexical_analysis");
const tokenize_1 = require("./tokenize");
const types_1 = require("./types");
function find_lexeme(run_state) {
    const code = run_state.overall_state.code, index = run_state.overall_state.index;
    const curr_char = code[index];
    if ((curr_char == ' ' || curr_char == '\n') && run_state.running == 'regular')
        return (0, lexical_analysis_1.setNextStep)(run_state, sanitize_escape);
    if (!run_state.current_state)
        return (0, lexical_analysis_1.setNextStep)(run_state, types_1.wrap_current_analysis);
    if (/[A-Za-z0-9]/.test(curr_char)) {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
    const running = run_state.running;
    if (running == 'string')
        (0, lexical_analysis_1.setNextStep)(run_state, sanitize_string);
    if (running == 'char')
        (0, lexical_analysis_1.setNextStep)(run_state, sanitize_char);
    if (running == 'm_comment' || running == 's_comment')
        (0, lexical_analysis_1.setNextStep)(run_state, sanitize_comment);
    return (0, lexical_analysis_1.setNextStep)(run_state, sanitize_regular);
}
function sanitize_regular(run_state) {
    const curr_char = run_state.overall_state.code[run_state.overall_state.index], next_char = run_state.overall_state.code[run_state.overall_state.index + 1];
    if (curr_char == '\"') {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.current_state.column += 1;
        run_state.running = 'string';
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
    if (curr_char == '\'') {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.current_state.column += 1;
        run_state.running = 'char';
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
    if (curr_char == '/' && next_char == '/') {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.current_state.column += 1;
        run_state.running = 's_comment';
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
    if (curr_char == '/' && next_char == '/*') {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.current_state.column += 1;
        run_state.running = 'm_comment';
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
    if (/\{|\}|\(|\)|\[|\]|;|.|,|:/.test(curr_char)) {
        if (run_state.current_state.lexeme.length > 0) {
            run_state.overall_state.column = run_state.current_state.column;
            return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
        }
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.current_state.column += run_state.current_state.column;
        return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
    }
    return (0, lexical_analysis_1.setNextStep)(run_state, handle_operators);
}
function sanitize_string(run_state) {
    const curr_char = run_state.overall_state.code[run_state.overall_state.index];
    if (curr_char == '\"') {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.current_state.column += 1;
        run_state.running = 'regular';
        return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
    }
}
function sanitize_char(run_state) {
    const curr_char = run_state.overall_state.code[run_state.overall_state.index];
    if (curr_char == '\'') {
        run_state.current_state.lexeme += curr_char;
        run_state.overall_state.index += 1;
        run_state.running = 'regular';
        if (run_state.current_state.lexeme.length > 3)
            run_state.overall_state.err.push(`at ${run_state.current_state.line}, ${run_state.current_state.column}. 
              Improper usage of single quotes ('), char literals shouldn't be longer than 1 character`);
        return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
    }
}
function sanitize_comment(run_state) {
    const code = run_state.overall_state.code, index = run_state.overall_state.index, curr_char = code[index];
    const hasEnded = (run_state.running == 's_comment' && curr_char == '\n') ||
        (run_state.running == 'm_comment' && curr_char == '*' && code[index + 1] == '/');
    if (hasEnded) {
        run_state.overall_state.index += 1;
        run_state.overall_state.line += run_state.current_state.line;
        run_state.overall_state.column = 0;
        run_state.current_state = undefined;
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
}
function sanitize_escape(run_state) {
    const curr_char = run_state.overall_state.code[run_state.overall_state.index];
    run_state.overall_state.index += 1;
    run_state.overall_state.line += curr_char == '\n' ? run_state.current_state?.line : 0;
    if (!run_state.current_state) {
        return (0, lexical_analysis_1.setNextStep)(run_state, find_lexeme);
    }
    run_state.overall_state.column += run_state.current_state.column;
    return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
}
function handle_operators(run_state) {
    if (run_state.current_state.lexeme.length > 0) {
        run_state.overall_state.column = run_state.current_state.column;
        return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
    }
    const code = run_state.overall_state.code;
    let i = 0, operator = "";
    for (; i < 3; i++) {
        const curr_index = run_state.overall_state.index + i;
        if (!/=|!|<|>|\+|-|\*|\/|\||&|%|\^/.test(code[curr_index]))
            break;
        operator += code[curr_index];
    }
    run_state.current_state.lexeme += operator;
    run_state.overall_state.index += i;
    run_state.current_state.column += i;
    return (0, lexical_analysis_1.setNextStep)(run_state, tokenize_1.tokenize);
}
