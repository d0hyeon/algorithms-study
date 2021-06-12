import Heap from './Heap';

class MinHeap extends Heap {
  compare(first: number, second: number) {
    if(first > second) {
      return true;
    }
    return false;
  }
}

export default MinHeap;