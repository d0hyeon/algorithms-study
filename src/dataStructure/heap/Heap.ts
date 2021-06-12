enum SortDirectionEnum {
  UP = 'up',
  DOWN = 'down'
}

type CompareCallback = (a: number, b: number) => Boolean;

class Heap {
  container: number[] = [];

  getParentIndex(childIndex: number) {
    return Math.floor((childIndex - 1) / 2);
  }
  getChildIndex(parentIndex: number, isRight: boolean = false) {
    return (parentIndex * 2) + (isRight ? 2 : 1);
  }
  hasChild(parentIndex: number, isRight: boolean = false) {
    return this.getChildIndex(parentIndex, isRight) < this.container.length;
  }

  add(value: number) {
    this.container.push(value);
    this.sort();
  }

  compare(first: number, second: number): boolean {
    throw('use MinHeap or MaxHeap');
  }

  swap(index: number, targetIndex: number) {
    const temp = this.container[index];
    this.container[index] = this.container[targetIndex];
    this.container[targetIndex] = temp;
  }

  find(item: number): number[] {
    const foundItemIndices = [];

    for (let itemIndex = 0; itemIndex < this.container.length; itemIndex += 1) {
      if (item === this.container[itemIndex]) {
        foundItemIndices.push(itemIndex);
      }
    }

    return foundItemIndices;
  }

  remove(item: number) {
    const removeIndexs = this.find(item);

    for (let iteration = removeIndexs.length; iteration >= 0; iteration --) {
      const indexToRemove: number = removeIndexs[iteration];
      if (indexToRemove === (this.container.length - 1)) {
        this.container.pop();
      } else {
        this.container[indexToRemove as number] = this.container.pop() as number;
        const parentItem = this.container[this.getParentIndex(indexToRemove)];
        
        if (
          this.hasChild(indexToRemove)
          && (
            !parentItem
            || this.compare(parentItem, this.container[indexToRemove])
          )
        ) {
          this.sort(indexToRemove, SortDirectionEnum.DOWN);
        } else {
          this.sort(indexToRemove, SortDirectionEnum.UP);
        }
      }
    }

    return this;
  }
  sort(startIdx?: number | null, direction: SortDirectionEnum = SortDirectionEnum.UP) {
    const isUpper = direction === SortDirectionEnum.UP;
    let currentIndex = startIdx ?? (
      isUpper
        ? this.container.length - 1
        : 0
    );
    
    if(isUpper) {
      let parentIndex = this.getParentIndex(currentIndex);
      while(parentIndex > -1) {
        const parent = this.container[parentIndex];
        if(this.compare(this.container[currentIndex], parent)) {
          break;
        }
        this.swap(currentIndex, parentIndex);
        currentIndex = parentIndex;
        parentIndex = this.getParentIndex(parentIndex);
      }
    } else {
      let nextIndex = null;
      while(this.hasChild(currentIndex)) {
        const leftChildIdx = this.getChildIndex(currentIndex);
        const rightChildIdx = this.getChildIndex(currentIndex, true);
        if(
          this.hasChild(currentIndex, true) &&
          !this.compare(
            this.container[leftChildIdx], 
            this.container[rightChildIdx]
          )
        ) {
          nextIndex = rightChildIdx;
        } else {
          nextIndex = leftChildIdx;
        }

        if(this.compare(this.container[currentIndex], this.container[nextIndex])) {
          break;
        }
        this.swap(currentIndex, nextIndex);
        currentIndex = nextIndex;
      }
    }
    return this;
  }
}

export default Heap;