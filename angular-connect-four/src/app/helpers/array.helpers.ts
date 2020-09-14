import { isPrimitive } from './common.helpers';

export function createArray<T>(length: number, fillWith: T): T[] {
  return Array.apply(null, Array(length)).map((item) => fillWith);
}

export function getColumnValues<T>(columnIndex: number, field: T[][]): T[] {
  return field.map((row) => row[columnIndex]);
}

export function cloneArray<T>(array: T[]): T[] {
  return array.map(cloneArrayItem);
}

function cloneArrayItem<T>(arrayItem: T): T {
  if (arrayItem instanceof Array) {
    return <T>(<unknown>cloneArray(arrayItem));
  } else if (!isPrimitive(arrayItem)) {
    return { ...arrayItem };
  } else {
    return arrayItem;
  }
}

export function sum(items: number[]): number {
  return items.reduce((itemSum, item) => itemSum + item, 0);
}
