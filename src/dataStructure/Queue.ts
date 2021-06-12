class QueueNode<T = any> {
  next: null | QueueNode<T> = null;
  value: T;

  constructor(value: T) {
    this.value = value;
  }
}

type Callback<T = any, R = void> = (arg: T) => R;

class Queue<T = any> {
  head: null | QueueNode<T> = null;
  tail: null | QueueNode<T> = null;
  size: number = 0;

  get isEmpty() {
    return !this.size;
  }
  
  isContain(value: T): boolean;
  isContain(callback: Callback<T, boolean>): boolean;
  isContain(arg: T | Callback<T, boolean>): boolean {
    const isFunction = arg instanceof Function;
    const compare = (value: T) => {
      if(isFunction) {
        return (arg as Callback)(value);
      }
      return value === arg
    }
    if(!this.head || !this.tail) {
      return false;
    }
    if(compare(this.head.value)) {
      return true;
    }
    if(compare(this.tail.value)) {
      return true;
    }
    let node: QueueNode | null = this.head;
    while(node) {
      if(compare(node.value)) {
        return true;
      }
      node = node.next;
    }
    return false;
  }

  push(value: T) {
    const node = new QueueNode<T>(value);
    if(this.head && this.tail) {
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.size ++;
  }

  pop(): T | undefined{
    if(this.head) {
      const head = this.head;
      this.head = this.head!.next;
      this.size -= 1;
      if(this.head === null) {
        this.tail = null;
      }
      return head.value;
    }
    return undefined;
  }
}

export default Queue