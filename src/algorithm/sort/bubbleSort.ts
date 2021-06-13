import { SortFunction } from './type';

const bubble: SortFunction = (array) => {
  for(let i = 0, length = array.length; i < length; i ++) {
    for(let j = 0; j < length-1; j ++) {
      if(array[j] > array[j+1]) {
        const temp = array[j];
        array[j] = array[j+1];
        array[j+1] = temp;
      }
    }
  }
  return array;
};

export default bubble;