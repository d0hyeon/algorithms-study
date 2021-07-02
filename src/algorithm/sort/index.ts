import type { SortPromise } from "./type";
import bubbleSort from './bubbleSort';
import selectionSort from "./selectionSort";
import insertionSort from './insertionSort';
import quickSort from './quickSort';

const sort: SortPromise = (array, sortFunction) => {
  return new Promise((resolve) => {
    const sortedArray = sortFunction([...array]);
    resolve(sortedArray)
  })
}

export {
  bubbleSort,
  selectionSort,
  insertionSort,
  quickSort,
}
export default sort;