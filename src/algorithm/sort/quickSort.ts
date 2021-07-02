import type { SortFunction } from './type';

const quickSort:SortFunction = (array) => {
  const length = array.length; 
  if(length === 0 ) { 
    return []; 
  } 
  
  const pivot = Math.floor(Math.random() * length);
  const middle = array[pivot]; 
  const left = [];
  const right = []; 

  for(let i = 0; i < length; i++) { 
    if(i === pivot) continue;
    if( array[i] < middle ) { 
      left.push(array[i]); 
    } else { 
      right.push(array[i]); 
    } 
  } 
  return [...quickSort(left), middle, ...quickSort(right)];


}


export default quickSort;