const { LinkedList } = require('../linked-list');

// Реализовать двустороннюю очередь на основе связанного списка

export class Queue {
  constructor() {
    this.queue = new LinkedList();
  }

  // add new item to the end of queue
  push(value) {
    this.queue.push(value);
  }

  // remove the last queue item, return the last
  pop() {
    const lastNode = this.queue.pop();
    return lastNode?.value ?? undefined;
  }

  // remove the first queue item, return the first
  shift() {
    const firstNode = this.queue.shift();
    return firstNode?.value ?? undefined;
  }

  // push to the queue head
  unshift(value) {
    return this.queue.unshift(value);
  }
}

console.log(`Hello Node.js v${process.versions.node}!`);

const dequeue = new Queue();

dequeue.push(10);
dequeue.unshift(11);
dequeue.push(12);

console.log(dequeue.pop()); // 12
console.log(dequeue.shift()); // 11
console.log(dequeue.pop()); // 10
console.log(dequeue.pop()); // Exception
