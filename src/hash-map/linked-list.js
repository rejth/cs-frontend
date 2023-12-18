const { DynamicArray } = require('../dynamic-array-linked-list');

export class LinkedListOfArrays extends DynamicArray {
  constructor(capacity) {
    super(capacity);
  }

  find(searchKey) {
    const values = [...this.values()];

    for (const [key, value] of values) {
      if (searchKey === key) return value;
    }

    return undefined;
  }

  mapKeys() {
    let current = this.first;
    return {
      *[Symbol.iterator]() {
        while (current) {
          for (const value of current.value) yield value[0];
          current = current.next;
        }
      },
    };
  }

  mapValues() {
    let current = this.first;
    return {
      *[Symbol.iterator]() {
        while (current) {
          for (const value of current.value) yield value[1];
          current = current.next;
        }
      },
    };
  }
}
