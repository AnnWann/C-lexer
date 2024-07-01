"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.run_as_chunks = run_as_chunks;
exports.wrap_as_chunkable = wrap_as_chunkable;
async function run_as_chunks(thisField, buffer) {
    const size = buffer.length;
    if (size <= 0)
        return thisField;
    if (thisField.predicate(size)) {
        thisField.chunk = thisField.reconstruct(thisField.chunk, buffer);
        return thisField.operand(thisField);
    }
    const [left, right] = thisField.split ? thisField.split(buffer) : [buffer.slice(0, size / 2), buffer.slice(size / 2, size - 1)];
    const right_result = await run_as_chunks(thisField, right);
    const left_result = await run_as_chunks(thisField, left);
    return thisField.join(thisField, left_result.chunk, right_result.chunk);
}
function wrap_as_chunkable(thisField) {
    const set_operand = (thisField, fn) => { thisField.operand = fn; return thisField; };
    const set_predicate = (thisField, fn) => { thisField.predicate = fn; return thisField; };
    const set_join = (thisField, fn) => { thisField.join = fn; return thisField; };
    const set_reconstruct = (thisField, fn) => { thisField.reconstruct = fn; return thisField; };
    const set_split = (thisField, fn) => { thisField.split = fn ? fn : undefined; return thisField; };
    return {
        chunk: thisField,
        run_as_chunks: run_as_chunks,
        set_operand,
        set_predicate,
        set_join,
        set_reconstruct,
        set_split: set_split
    };
}
