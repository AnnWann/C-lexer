
export function run_as_chunks<B extends Array<any> | string, T>(
  thisField: T, 
  buffer: B, 
  predicate: (size: number) => boolean, 
  operand: (thisField: T) => T, 
  join: (left: T, right: T) => T, 
  reconstruct?: (thisField: T, buffer: B) => T,
  split_rule?: (buffer: B) => B[]): T
{

  const size = buffer.length;

  if(size <= 0) return thisField;

  if(predicate(size)) return operand(reconstruct(thisField, buffer));

  const [left, right] = split_rule ? split_rule(buffer) : [buffer.slice(0, size/2), buffer.slice(size/2, size - 1)];

  const right_result = run_as_chunks(thisField, right, predicate, operand, join, reconstruct, split_rule);
  const left_result = run_as_chunks(thisField, left, predicate, operand, join, reconstruct, split_rule);
  
  
  return join(left_result, right_result);
}
