
class StackNode<T> {
  value: T;
  next: any = null;
  prev: any = null;

  constructor(value: T) {
    this.value = value;
  }
}

class Stack<T = any> {
  head: StackNode<T> | null = null;
  tail: StackNode<T> | null = null;
  size: number = 0;

  push(value: T) {
    const node = new StackNode<T>(value);
    if(this.head && this.tail) {
      node.prev = this.tail;
      this.tail.next = node;
      this.tail = node;
    } else {
      this.head = node;
      this.tail = node;
    }
    this.size ++;
  }
  pop(): T | undefined {
    if(this.tail) {
      if(this.head === this.tail) {
        const value = this.head.value;
        this.head = null;
        this.tail = null;
        this.size = 0;
        return value;
      }
      const temp = this.tail;
      this.tail = this.tail.prev;
      this.tail!.next = null;
      temp.prev = null;
      this.size --;
      return temp.value;
    }
    return undefined;
  }
}

export default Stack;