export class TaskQueue {
  #heap = [];
  #lastIndex = -1;
  #comparator = null;

  constructor(comparator) {
    this.#comparator = comparator;
  }

  push(value) {
    this.#heap[++this.#lastIndex] = value;

    if (this.#lastIndex > 0) {
      this.#liftChildUp();
    }

    return this;
  }

  pop() {
    const head = this.#heap[0];

    if (this.#lastIndex >= 0) {
      this.#heap[0] = this.#heap[this.#lastIndex];
      this.#heap[this.#lastIndex] = undefined;
      this.#lastIndex--;

      if (this.#lastIndex > -1) {
        this.#liftChildDown();
      }
    }

    return head;
  }

  #liftChildUp() {
    let cursor = this.#lastIndex;
    let child = this.#heap[cursor];

    while (cursor > 0) {
      const parentIndex = this.#getParentIndex(cursor);
      const parent = this.#heap[parentIndex];

      if (this.#comparator(parent, child) >= 0) break;

      this.#heap[cursor] = parent;
      cursor = parentIndex;
    }

    this.#heap[cursor] = child;
  }

  #liftChildDown() {
    let cursor = 0;
    let leftChildIndex = this.#getLeftChildIndex(cursor);
    let rightChildIndex = this.#getRightChildIndex(cursor);

    const head = this.#heap[cursor];

    while (leftChildIndex <= this.#lastIndex) {
      let childIndex;
      const leftChild = this.#heap[leftChildIndex];
      const rightChild = this.#heap[rightChildIndex];

      if (rightChildIndex > this.#lastIndex) {
        childIndex = leftChildIndex;
      } else {
        childIndex = this.#comparator(leftChild, rightChild) > 0 ? leftChildIndex : rightChildIndex;
      }

      const child = this.#heap[childIndex];

      if (this.#comparator(head, child) >= 0) break;

      this.#heap[cursor] = child;
      cursor = childIndex;

      leftChildIndex = this.#getLeftChildIndex(cursor);
      rightChildIndex = this.#getRightChildIndex(cursor);
    }

    this.#heap[cursor] = head;
  }

  #getParentIndex(index) {
    return Math.floor((index - 1) / 2);
  }

  #getLeftChildIndex(index) {
    return index * 2 + 1;
  }

  #getRightChildIndex(index) {
    return index * 2 + 2;
  }
}

const sortSchema = ['low', 'medium', 'high', 'critical'];

const queue = new TaskQueue((a, b) => sortSchema.indexOf(a.priority) - sortSchema.indexOf(b.priority));

queue.push({ value: 1, priority: 'medium' });
queue.push({ value: 5, priority: 'critical' });
queue.push({ value: 2, priority: 'high' });
queue.push({ value: -1, priority: 'low' });
queue.push({ value: 5, priority: 'critical' });
queue.push({ value: 2, priority: 'high' });
queue.push({ value: -1, priority: 'low' });
queue.push({ value: 5, priority: 'critical' });

console.log(queue.pop()); // 5
console.log(queue.pop()); // 5
console.log(queue.pop()); // 5

console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
console.log(queue.pop());
