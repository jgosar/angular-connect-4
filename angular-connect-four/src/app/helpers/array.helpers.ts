import { isPrimitive } from './common.helpers';

export function createArray<T>(length: number, fillWith: T): T[] {
  return Array.apply(null, Array(length)).map((item) => cloneItem(fillWith));
}

export function getColumnValues<T>(columnIndex: number, field: T[][]): T[] {
  return field.map((row) => row[columnIndex]);
}

export function cloneArray<T>(array: T[]): T[] {
  return array.map(cloneItem);
}

function cloneItem<T>(item: T): T {
  if (item instanceof Array) {
    return <T>(<unknown>cloneArray(item));
  } else if (!isPrimitive(item)) {
    return { ...item };
  } else {
    return item;
  }
}

export function sum(items: number[]): number {
  return items.reduce((itemSum, item) => itemSum + item, 0);
}

export function findMax<T>(items: T[], rankingProperty: (item: T) => number): T | undefined {
  if (items.length === 0) {
    return undefined;
  }
  return items.reduce(
    (maxItem, currentItem) => (rankingProperty(currentItem) > rankingProperty(maxItem) ? currentItem : maxItem),
    items[0]
  );
}
