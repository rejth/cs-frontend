// Необходимо написать функцию forEach, которая могла бы обходить любой Iterable объект любого размера.
// Работа функции не должна вызывать фризов. Функция должна возвращать Promise.

export function forEach(iterable, fn) {
  return new Promise((resolve, reject) => {
    const launchTime = Date.now();
    let start = Date.now();

    const MAX = 50;
    const DELAY = 2000;

    function* createWorker() {
      let i = 0;

      for (const item of iterable) {
        try {
          fn(item, i++, iterable);
        } catch (e) {
          reject(e);
          return;
        }

        let end = Date.now();

        if (end - start > MAX) {
          setTimeout(() => {
            start = Date.now();
            worker.next();
          }, DELAY);

          yield 'sleep';
        }
      }

      resolve(`Call to the function took ${end - launchTime} milliseconds`);
    }

    const worker = createWorker();
    worker.next();
  });
}

let total = 0;

forEach(new Array(10e6).fill(1), (item, i, _iterable) => {
  total++;
  console.log('current item:', item);
  console.log('index:', i);
})
  .then((result) => {
    console.log('resolved result:', result);
  })
  .catch(console.error);

console.log('SYNC TASK TOTAL: ', total);
