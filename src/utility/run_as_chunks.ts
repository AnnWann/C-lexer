
export async function run_as_chunks<B extends Buffer | string, T>(
  thisField: T, 
  buffer: B, 
  predicate: (size: number) => boolean, 
  operand: (thisField: T) => T, 
  join: (left: T, right: T) => T, 
  split_rule?: (buffer: B) => B[]): Promise<T>
{

  const size = buffer.length;

  if(size <= 0) return thisField;

  if(predicate(size)) return operand(thisField);

  const [left, right] = split_rule ? split_rule(buffer) : [buffer.slice(0, size/2), buffer.slice(size/2, size - 1)];

  const right_result = await run_as_chunks(thisField, right, predicate, operand, join, split_rule);
  const left_result = await run_as_chunks(thisField, left, predicate, operand, join, split_rule);
  
  
  return join(left_result, right_result);
}
