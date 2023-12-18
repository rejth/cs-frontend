const { LinkedListOfArrays } = require('./linked-list.js');

// 1. Реализовать хеш-таблицу, где все ключи преобразуются в строку (любой алгоритм хэширования).
// Метод разрешения коллизий - метод цепочек (Linked List of Arrays)
// 2. Добавить метод keys, который возвращает итератор с ключами (в любом порядке), которые есть в таблице

export class HashMap {
  constructor(capacity) {
    this.capacity = capacity;
    this.size = 0;
    this.array = new Array(capacity);

    for (let i = 0; i < this.capacity; i++) {
      this.array[i] = new LinkedListOfArrays(capacity);
    }
  }

  hash(key) {
    key = String(key);
    let hashValue = 0;

    for (let i = 0; i < key.length; i++) {
      const code = key.charCodeAt(0);
      hashValue = (hashValue * 27 + code) % this.capacity;
    }

    return hashValue;
  }

  set(key, value) {
    const index = this.hash(key);
    const linkedList = this.array[index];
    linkedList.add([key, value]);

    this.size++;
    return this;
  }

  get(key) {
    const index = this.hash(key);
    const linkedList = this.array[index];
    const value = linkedList.find(key);

    return value;
  }

  keys() {
    const that = this;
    return {
      *[Symbol.iterator]() {
        for (const linkedList of that.array) {
          yield* linkedList.mapKeys();
        }
      },
    };
  }

  values() {
    const that = this;
    return {
      *[Symbol.iterator]() {
        for (const linkedList of that.array) {
          yield* linkedList.mapValues();
        }
      },
    };
  }
}

const map = new HashMap(11);

map.set('foo', 'bar');
map.set(10, 'bla');

console.log(map);
console.log(map.get('foo')); // 'bar'
console.log(map.get(10)); // 'bla'

for (const key of map.keys()) {
  console.log('Key of Hash Map: ', key);
}

for (const key of map.values()) {
  console.log('Value of Hash Map: ', key);
}
