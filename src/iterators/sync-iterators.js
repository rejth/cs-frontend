const str = '12345';
const arr = [1, 2, 3, 4];
const obj = { a: 32, b: 12, c: 16, d: 8 };
const set = new Set([1, 1, 2, 3, 3, 3, 4, 5]);
const map = new Map([
  ['огурец', 500],
  ['помидор', 350],
  ['лук', 50],
]);

//----------------------------------------------------------------------------
// Необходимо написать итератор для генерации случайных чисел по заданным параметрам
function random(start, end) {
  const getRandomNumber = () => {
    return Math.floor(start + Math.random() * (end + 1 - start));
  };

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      return {
        done: false,
        value: getRandomNumber(),
      };
    },
  };
}

const randomInt = random(0, 100);
// console.log(randomInt.next());
// console.log(randomInt.next());
// console.log(randomInt.next());
// console.log(randomInt.next());

//----------------------------------------------------------------------------
// Необходимо написать функцию take, которая принимает любой Iterable объект и возвращает итератор по заданному количеству его элементов
function take(iterable, count) {
  const iterator = iterable[Symbol.iterator]();
  let cursor = 0;

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      return {
        done: count === cursor++,
        value: iterator.next().value,
      };
    },
  };
}

console.log('TAKE------------------------------------------------------------');
const takeIterator = take(map, 2);

console.log([...takeIterator]);
console.log(takeIterator.next());
console.log([...take(arr, 2)]);
console.log([...take(Object.values(obj), 2)]);
console.log([...take(map, 2)]);
console.log([...take(set, 2)]);
console.log([...take(str, 2)]);
console.log([...take(random(0, 100), 5)]);

//----------------------------------------------------------------------------
// Необходимо написать функцию filter, которая принимает любой Iterable объект и функцию-предикат. И возвращает итератор по элементам которые удовлетворяют предикату.
function filter(iterable, onFilter) {
  const iterator = iterable[Symbol.iterator]();

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      const current = iterator.next();
      if (!onFilter(current.value) && !current.done) return this.next();
      return current;
    },
  };
}

console.log('FILTER-----------------------------------------------------');
const filterIterator = filter(set, (el) => el > 3);

console.log(filterIterator.next());
console.log([
  ...take(
    filter(random(0, 100), (el) => el > 95),
    5,
  ),
]);
console.log([...filter(arr, (el) => el > 2)]);
console.log([...filter(Object.values(obj), (el) => el > 16)]);
console.log([...filter(map, (el) => el?.[0] === 'помидор')]);
console.log([...filter(set, (el) => el > 3)]);
console.log([...filter(str, (el) => el === '2')]);

//----------------------------------------------------------------------------
// Необходимо написать функцию enumerate, которая принимает любой Iterable объект и возвращает итератор по парам (номер итерации, элемент)
function enumerate(iterable) {
  const iterator = iterable[Symbol.iterator]();
  let cursor = 0;

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      const current = iterator.next();

      return {
        done: current.done,
        value: [cursor++, current.value],
      };
    },
  };
}

console.log('ENUMERATE---------------------------------------------------');
const enumerateIterator = enumerate(map);

console.log(enumerateIterator.next());
console.log([...take(enumerate(random(0, 100)), 3)]); // [[0, ...], [1, ...], [2, ...]]
console.log([...enumerate(map)]);
console.log([...enumerate(set)]);

//----------------------------------------------------------------------------
// Необходимо написать функцию seq, которая бы принимала множество Iterable объектов и возвращала итератор по их элементам
function seq(...iterables) {
  let cursor = 0;
  let iterator = iterables[cursor][Symbol.iterator]();

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      let current = iterator.next();

      if (current.done) {
        cursor++;
        if (cursor !== iterables.length) {
          iterator = iterables[cursor][Symbol.iterator]();
          current = iterator.next();
        }
      }

      return {
        done: cursor === iterables.length,
        value: current.value,
      };
    },
  };
}

console.log('SEQ-----------------------------------------------------');
const seqIterator = seq(set, map);

console.log(seqIterator.next());
console.log([...seq(set, map)]);

//----------------------------------------------------------------------------
// Необходимо написать функцию zip, которая бы принимала множество Iterable объектов и возвращала итератор по кортежам их элементов
function zip(...iterables) {
  const iterators = Array.from(iterables).map((iterable) => iterable[Symbol.iterator]());

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      const results = iterators.map((iterator) => iterator.next());

      return {
        done: results.every((res) => res.done),
        value: results.map((res) => res.value),
      };
    },
  };
}

console.log('ZIP---------------------------------------------------------');
const zipIterator = zip([1, 2], new Set([3, 4]), 'bl');

console.log(zipIterator.next());
console.log([...zip([1, 2], new Set([3, 4]), 'bl')]); // [[1, 3, b], [2, 4, 'l']]

//----------------------------------------------------------------------------
// Необходимо написать функцию, которая принимала бы любой Iterable объект и Iterable с функциями и возвращала итератор где каждому элементу левого Iterable последовательно применяются все функции из правого

function mapSeq(iterableData, iterableCb) {
  const iterator = iterableData[Symbol.iterator]();

  return {
    [Symbol.iterator]() {
      return this;
    },

    next() {
      const cbIterator = iterableCb[Symbol.iterator]();

      let { done, value } = iterator.next();
      let cb = cbIterator.next();

      while (!cb.done) {
        value = cb.value(value);
        cb = cbIterator.next();
      }

      return { done, value };
    },
  };
}

console.log('MAPSEQ---------------------------------------------------------');
const mapSeqIterator = mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1]);

console.log(mapSeqIterator.next());
console.log([...mapSeqIterator]);
console.log(...mapSeq([1, 2, 3], [(el) => el * 2, (el) => el - 1])); // [1, 3, 5]
