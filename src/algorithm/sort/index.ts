import { Sort } from "./type";
import bubbleSort from './bubbleSort';
import selectionSort from "./selectionSort";
const sort: Sort = (array, sortFunction) => {
  return sortFunction([...array]);
}

export {
  bubbleSort,
  selectionSort
}
export default sort;