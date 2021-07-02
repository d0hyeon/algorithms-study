import { SortFunction } from './type';

const insertionSort: SortFunction = (array) => {
  const length = array.length;
  if(length < 1) {
    return array;
  }
  for(let i = 1; i < length; i ++) {
    let y = i;
    while(y >= 0 && array[y] < array[y-1]) {
      const temp = array[y-1];
      array[y-1] = array[y];
      array[y] = temp;
      y --;
    }
  }
  return array; 
}

export default insertionSort;