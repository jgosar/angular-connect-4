export function isPrimitive(value: any) {
  return value !== Object(value);
}

export function range(start: number, end: number): number[] {
  const result: number[] = new Array(end - start);
  for (let i = 0; i < end - start; i++) {
    result[i] = i + start;
  }
  return result;
}
