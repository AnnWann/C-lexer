"use strict";
/*
 * This file is responsible with building a valid lexeme out of the source content
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.is_char_part_of_lexeme = is_char_part_of_lexeme;
const run_through_lexical_analysis_1 = require("./run_through_lexical_analysis");
const types_1 = require("./types");
/**
 * verify if char being currently analysed is part of a valid lexeme
 */
function is_char_part_of_lexeme(run_state) {
    const code = run_state.parser.code, index = run_state.parser.index, curr_char = code[index], running = run_state.running;
    if ((curr_char == ' ' || curr_char == '\n' || curr_char == '\r') && running == 'default')
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, sanitize_escape);
    if (!run_state.parser.current_lexeme)
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, types_1.wrap_current_lexeme);
    if (/[A-Za-z0-9_]/.test(curr_char)) {
        run_state.parser.current_lexeme.value = run_state.parser.current_lexeme.value += curr_char;
        run_state.parser.index += 1;
        run_state.parser.current_lexeme.end.column += 1;
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    if (running == 'string')
        (0, run_through_lexical_analysis_1.setNextStep)(run_state, sanitize_string);
    if (running == 'm_comment' || running == 's_comment')
        (0, run_through_lexical_analysis_1.setNextStep)(run_state, sanitize_comment);
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, sanitize_default);
}
/**
 * handles the case in which the current char is a stop sign and the analysis is in default mode
 */
function sanitize_default(run_state) {
    if (run_state.parser.current_lexeme.value !== '') {
        run_state.parser.lexemes.push(run_state.parser.current_lexeme);
        run_state.parser.position = run_state.parser.current_lexeme.end;
        run_state.parser.current_lexeme = undefined;
        run_state.parser.position.column += 1;
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    const curr_char = run_state.parser.code[run_state.parser.index], next_char = run_state.parser.code[run_state.parser.index + 1];
    if (curr_char == '\"' || curr_char == '\'') {
        run_state.parser.current_lexeme.value = run_state.parser.current_lexeme.value += curr_char;
        run_state.parser.lexemes.push(run_state.parser.current_lexeme);
        run_state.parser.current_lexeme = undefined;
        run_state.parser.index += 1;
        run_state.parser.position.column += 1;
        run_state.running = 'string';
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    if (curr_char == '/' && next_char == '/') {
        run_state.parser.current_lexeme.value = run_state.parser.current_lexeme.value += curr_char + next_char;
        run_state.parser.lexemes.push(run_state.parser.current_lexeme);
        run_state.parser.current_lexeme = undefined;
        run_state.parser.index += 1;
        run_state.parser.position.column += 2;
        run_state.running = 's_comment';
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    if (curr_char == '/' && next_char == '*') {
        run_state.parser.current_lexeme.value = run_state.parser.current_lexeme.value += curr_char + next_char;
        run_state.parser.lexemes.push(run_state.parser.current_lexeme);
        run_state.parser.current_lexeme = undefined;
        run_state.parser.index += 2;
        run_state.parser.position.column += 2;
        run_state.running = 'm_comment';
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    if (/\{|\}|\(|\)|\[|\]|;|.|,|:/.test(curr_char))
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, handle_ponctuation);
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, handle_operators);
}
/**
 * handles the case in which the current char is a stop sign and the analysis is in string mode
 */
function sanitize_string(run_state) {
    const curr_char = run_state.parser.code[run_state.parser.index];
    const quote_type = run_state.parser.lexemes[run_state.parser.lexemes.length - 1].value;
    if (curr_char === quote_type) {
        const size = run_state.parser.current_lexeme.value.length, { line, column } = run_state.parser.current_lexeme.end;
        const content = {
            value: run_state.parser.current_lexeme.value.substring(0, size - 2),
            start: run_state.parser.current_lexeme.start,
            end: { line, column: column - 1 },
            literal: true
        };
        run_state.parser.lexemes.push(content);
        run_state.parser.lexemes.push({ value: curr_char, start: { line, column }, end: { line, column } });
        run_state.parser.position = run_state.parser.current_lexeme.end;
        run_state.running = 'default';
        run_state.parser.index += 1;
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    else if (curr_char === '\n') {
        run_state.parser.current_lexeme.end.line += 1;
        run_state.parser.current_lexeme.end.column = 0;
        run_state.parser.index += 1;
    }
    else {
        run_state.parser.index += 1;
        run_state.parser.current_lexeme.end.column += 1;
    }
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
}
/**
 * handles the case in which the current char is a stop sign and the analysis is in s_comment or m_comment mode
 */
function sanitize_comment(run_state) {
    const code = run_state.parser.code, index = run_state.parser.index, curr_char = code[index], next_char = code[index + 1];
    const hasEnded = (run_state.running == 's_comment' && curr_char == '\n') ||
        (run_state.running == 'm_comment' && curr_char == '*' && next_char == '/');
    if (curr_char == '\n') {
        run_state.parser.current_lexeme.end.line += 1;
        run_state.parser.current_lexeme.end.column = 0;
    }
    if (hasEnded) {
        const size = run_state.parser.current_lexeme.value.length, { line, column } = run_state.parser.current_lexeme.end;
        if (run_state.parser.current_lexeme) {
            const content = {
                value: run_state.parser.current_lexeme.value.substring(0, size - 1),
                start: run_state.parser.current_lexeme.start,
                end: { line, column: column - 1 },
                literal: true
            };
            run_state.parser.lexemes.push(content);
        }
        run_state.parser.lexemes.push({ value: curr_char + next_char, start: { line, column }, end: { line, column } });
        run_state.parser.index += run_state.running === "m_comment" ? 2 : 1;
        run_state.parser.position = run_state.parser.current_lexeme.end;
        run_state.parser.current_lexeme = undefined;
        run_state.running = 'default';
        return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
    }
    run_state.parser.index += 1;
    run_state.parser.current_lexeme.end.column += 1;
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
}
/**
 * handles the case in which the current char is a espace sign and the analysis is in default mode
 */
function sanitize_escape(run_state) {
    const curr_char = run_state.parser.code[run_state.parser.index];
    run_state.parser.position.line +=
        curr_char === '\n' ?
            run_state.parser.current_lexeme ?
                run_state.parser.current_lexeme.end.line :
                1 :
            0;
    run_state.parser.index += 1;
    if (curr_char === '\n')
        run_state.parser.position.line += run_state.parser.current_lexeme ? run_state.parser.current_lexeme.end.line : 1;
    if (run_state.parser.current_lexeme) {
        run_state.parser.position = run_state.parser.current_lexeme.end;
        run_state.parser.lexemes.push(run_state.parser.current_lexeme);
        run_state.parser.current_lexeme = undefined;
    }
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
}
/**
 * handles the case in which the current char is a ponctuation sign and the analysis is in default mode
 */
function handle_ponctuation(run_state) {
    const curr_char = run_state.parser.code[run_state.parser.index];
    const pos = run_state.parser.position;
    run_state.parser.lexemes.push({ value: curr_char, start: pos, end: pos });
    run_state.parser.current_lexeme = undefined;
    run_state.parser.position.column += 1;
    run_state.running = 'default';
    run_state.parser.index += 1;
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
}
/**
 * handles the case in which the current char is an operator sign and the analysis is in default mode
 */
function handle_operators(run_state) {
    const code = run_state.parser.code;
    let i = 0, operator = code[run_state.parser.index];
    for (; i < 3; i++) {
        const curr_index = run_state.parser.index + i;
        if (!/=|!|<|>|\+|-|\*|\/|\||&|%|\^/.test(code[curr_index]))
            break;
        operator += code[curr_index];
        run_state.parser.current_lexeme.end.column += 1;
    }
    run_state.parser.current_lexeme.value = operator;
    run_state.parser.lexemes.push(run_state.parser.current_lexeme);
    run_state.parser.index += i;
    run_state.parser.position = run_state.parser.current_lexeme.end;
    run_state.parser.current_lexeme = undefined;
    return (0, run_through_lexical_analysis_1.setNextStep)(run_state, is_char_part_of_lexeme);
}
