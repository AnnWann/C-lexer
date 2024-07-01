import { is_char_part_of_lexeme } from "../lexical_analysis/find_lexeme";
import { run } from "../lexical_analysis/run_through_lexical_analysis";
import { lexeme, run_state, wrap_run_state } from "../lexical_analysis/types";
import { join_lexemes, split_code } from "./run_state_util";

export {
  run_as_chunks,
  wrap_as_chunkable,
  chunkable
}
async function run_as_chunks<T, B extends Array<any> | string>(thisField: chunkable<T,B>, buffer: B): Promise<chunkable<T,B>>
{

  const size = buffer.length;

  if(size <= 0) return thisField;

  if(thisField.predicate(size)){
    thisField.chunk = thisField.reconstruct(thisField.chunk, buffer);
    return thisField.operand(thisField);
  } 

  const [left, right] = thisField.split ? thisField.split(buffer) : [buffer.slice(0, size/2), buffer.slice(size/2, size - 1)];

  const right_result = await run_as_chunks(thisField, right);
  const left_result = await run_as_chunks(thisField, left);
  
  return thisField.join(thisField, left_result.chunk, right_result.chunk);
}

type chunkable<T, B extends Array<any> | string> = {
  chunk: T,
  predicate?: (size: number) => boolean, 
  operand?: (chunkable: chunkable<T,B>) => chunkable<T,B>, 
  join?: (chunkable: chunkable<T,B>, left: T, right: T) => chunkable<T,B>, 
  reconstruct?: (thisField: T, buffer: B) => T,
  split?: (buffer: B) => B[],
  run_as_chunks: (thisField: chunkable<T,B>, buffer: B) => Promise<chunkable<T,B>>,
  set_operand: (thisField: chunkable<T,B>, fn: (chunkable: chunkable<T,B>) => chunkable<T, B>) => chunkable<T,B>,
  set_predicate: (thisField: chunkable<T,B>, fn: (size: number) => boolean) => chunkable<T,B>,
  set_join: (thisField: chunkable<T,B>, fn: (chunkable: chunkable<T,B>, left: T, right: T) => chunkable<T,B>) => chunkable<T,B>, 
  set_reconstruct: (thisField: chunkable<T,B>, fn: (thisField: T, buffer: B) => T) =>  chunkable<T,B>,
  set_split: (thisField: chunkable<T,B>, fn?: (buffer: B) => B[]) => chunkable<T,B>
}

function wrap_as_chunkable<T, B extends Array<any> | string>(thisField: T): chunkable<T, B>{
  const set_operand = (thisField: chunkable<T,B>, fn: (chunkable: chunkable<T,B>) => chunkable<T,B>): chunkable<T,B> => { thisField.operand = fn; return thisField};
  const set_predicate = (thisField: chunkable<T,B>, fn: (size: number) => boolean): chunkable<T,B> => { thisField.predicate = fn; return thisField };
  const set_join = (thisField: chunkable<T,B>, fn: (chunkable: chunkable<T,B>, left: T, right: T) => chunkable<T,B>): chunkable<T,B> => { thisField.join = fn; return thisField };
  const set_reconstruct = (thisField: chunkable<T,B>, fn: (thisField: T, buffer: B) => T): chunkable<T,B> => { thisField.reconstruct = fn; return thisField };
  const set_split = (thisField: chunkable<T,B>, fn?: (buffer: B) => B[]): chunkable<T,B> => { thisField.split = fn ? fn : undefined; return thisField };
  
  return {
    chunk: thisField,
    run_as_chunks: run_as_chunks,
    set_operand,
    set_predicate,
    set_join,
    set_reconstruct,
    set_split: set_split
  }
}
