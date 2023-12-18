// Реализовать динамический расширяемый массив на основе связанного списка (список массивов заданной емкости). Для получения элемента по индексу добавить метод. Сделать такой массив итерируемым.

class DynamicArrayNode {
  constructor(value) {
    this.value = value;
    this.next = null;
    this.prev = null;
  }
}

export class DynamicArray {
  constructor(capacity) {
    this.capacity = capacity;
    this.length = 0;
    this.first = null;
    this.last = null;
  }

  add(value) {
    if (this.length === 0) {
      const newArray = new Array(this.capacity).fill(undefined);
      const node = new DynamicArrayNode(newArray);

      this.first = node;
      this.first.value[0] = value;
      this.last = this.first;

      this.length++;
      return this;
    }

    let current = this.first;

    while (current.next) {
      current = current.next;
    }

    const freeSpaceIndex = current.value.indexOf(undefined);

    if (freeSpaceIndex >= 0) {
      current.value[freeSpaceIndex] = value;
    } else {
      const newArray = new Array(this.capacity).fill(undefined);
      const node = new DynamicArrayNode(newArray);
      current.next = node;
      current.next.value[0] = value;

      const currentLast = this.last;
      this.last = current.next;
      this.last.prev = currentLast;
    }

    this.length++;
    return this;
  }

  get(index) {
    for (let i = 0; i <= this.length; i++) {
      if (i === index) return [...this.values()][i];
    }
  }

  values() {
    let current = this.first;
    return {
      *[Symbol.iterator]() {
        while (current) {
          for (const value of current.value) {
            if (value) yield value;
          }
          current = current.next;
        }
      },
    };
  }
}

const arr = new DynamicArray(3 /* Размер фиксированного массива в списке */);

arr.add(1);
arr.add(2);
arr.add(3);
arr.add(4);
arr.add(5);

console.log(arr);

console.log(arr.get(0)); // 1
console.log(arr.get(1)); // 2
console.log(arr.get(2)); // 3
console.log(arr.get(3)); // 4
console.log(arr.get(4)); // 5

for (const value of arr.values()) {
  console.log('Value of Dynamic Array: ', value);
}
