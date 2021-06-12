import Heap from './Heap';

class MaxHeap extends Heap {
  compare(first: number, second: number) {
    if(first > second) {
      return true;
    }
    return false;
  }
}

export default MaxHeap;