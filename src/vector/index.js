// Реализовать динамический расширяемый массив как вектор. Необходимо поддержать возможность указания ёмкости.

export class Vector {
  constructor(capacity) {
    this.capacity = capacity;
    this.length = 0;
    this.array = new Array(capacity);
  }

  add(value) {
    if (this.length === this.capacity) this.#updateArrayCapacity();
    this.array[this.length] = value;
    this.length++;
    return this;
  }

  get(index) {
    return this.array[index];
  }

  #updateArrayCapacity() {
    this.capacity = Math.ceil(this.capacity * 2.3);
    const newArray = new Array(this.capacity);

    for (let i = 0; i < this.length; i++) {
      newArray[i] = this.array[i];
    }

    this.array = newArray;
  }
}

const arr = new Vector(2);

arr.add(1);
arr.add(2);
arr.add(3);
arr.add(4);
arr.add(5);

console.log(arr.get(0)); // 1
console.log(arr.get(1)); // 2
console.log(arr.get(4)); // 5
