import {SortFunction} from './type';

const selectionSort: SortFunction = (array) => {
  for(let i = 0, length = array.length; i < length; i ++) {
    let minIdx = i;
    for(let j = i + 1; j < length; j ++) {
      if(array[minIdx] > array[j]) {
        minIdx = j;
      }
    }
    if(minIdx !== i) {
      const temp = array[i];
      array[i] = array[minIdx];
      array[minIdx] = temp;
    }
  }
  return array;
}

export default selectionSort;