// Реализовать двусторонний двунаправленный связанный список

class ListNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class LinkedList {
  constructor() {
    this.first = null;
    this.last = null;
    this.length = 0;
  }

  push(value) {
    const node = new ListNode(value);

    if (this.length === 0) {
      this.first = node;
      this.last = node;
    } else {
      let current = this.first;
      const currentLast = this.last;

      this.last = node;
      this.last.prev = currentLast;

      while (current.next) {
        current = current.next;
      }

      current.next = node;
      current.next.prev = currentLast;
    }

    this.length++;
    return this;
  }

  unshift(value) {
    const node = new ListNode(value);

    if (this.length === 0) {
      this.first = node;
      this.last = node;
    } else {
      const currentFirst = this.first;
      this.first = node;
      this.first.next = currentFirst;
      this.first.next.prev = this.first;
    }

    return ++this.length;
  }

  pop() {
    if (!this.last) return undefined;
    const currentLast = this.last;

    if (this.length > 1) {
      this.last = currentLast.prev;
      this.last.next = null;
    }

    this.length--;

    if (this.length === 0) {
      this.first = null;
      this.last = null;
    }

    return currentLast;
  }

  shift() {
    if (!this.first) return undefined;
    const currentFirst = this.first;

    if (this.length > 1) {
      this.first = currentFirst.next;
      this.first.prev = null;
    }

    this.length--;

    if (this.length === 0) {
      this.first = null;
      this.last = null;
    }

    return currentFirst;
  }

  values() {
    let currentNode = this.first;
    return {
      *[Symbol.iterator]() {
        while (currentNode) {
          yield currentNode.value;
          currentNode = currentNode.next;
        }
      },
    };
  }
}

console.log(`Hello Node.js v${process.versions.node}!`);

const list = new LinkedList();

list.push(1);
list.push(2);
list.push(3);

// list.unshift(1234);

// const last = list.pop();
// console.log('last: ', last);

// const first = list.shift();
// console.log('first', first);

console.log('list:', list);

console.log(list.first.value); // 1
console.log(list.last.value); // 3

console.log(list.last.prev.next.value); // 3
console.log(list.last.prev.prev.value); // 1

console.log(list.first.next.value); // 2
console.log(list.first.next.next.value); // 3
console.log(list.first.next.prev.value); // 1

for (const value of list.values()) {
  console.log('Value of Iterable Linked list: ', value);
}
