// Необходимо написать функцию allLimit, которая бы принимала Iterable функций, возвращающих Promise (или обычные значения) и лимит одновременных Promise.
// Одновременно не должно быть более заданного числа Promise в Pending.

export function allLimit1(iterable, limit) {
  if (typeof iterable[Symbol.iterator] !== 'function') {
    throw new Error('The function argument is not iterable');
  }

  const tasks = Array.from(iterable);
  if (tasks.length === 0) return Promise.resolve([]);

  return new Promise(async (resolve, reject) => {
    let results = [];
    try {
      while (tasks.length !== 0) {
        const limited = tasks.splice(0, limit);
        const middle = await Promise.all(limited);
        results = [...results, ...middle];
      }
      resolve(results);
    } catch (e) {
      reject(e);
    }
  });
}

export function allLimit(iterable, limit) {
  if (typeof iterable[Symbol.iterator] !== 'function') {
    throw new Error('The function argument is not iterable');
  }

  const tasks = Array.from(iterable);
  if (tasks.length === 0) return Promise.resolve([]);

  const results = new Array(tasks.length);
  const iterator = iterable[Symbol.iterator]();

  let pending = 0;
  let done = 0;
  let cursor = 0;
  let rejected = false;

  const executeMicroTask = (fn, index, resolve, reject) => {
    Promise.resolve(fn())
      .then((value) => {
        done++;
        pending--;

        results[index] = value;
        if (done === tasks.length) resolve(results);

        if (pending < limit) {
          const next = iterator.next();
          if (!next.done && !rejected) {
            pending++;
            executeMicroTask(next.value, cursor, resolve, reject);
            cursor++;
          }
        }
      })
      .catch((e) => {
        rejected = true;
        reject(e);
      });
  };

  return new Promise((resolve, reject) => {
    for (let i = 0; i < limit; i++) {
      const next = iterator.next();
      if (!next.done) {
        pending++;
        executeMicroTask(next.value, cursor, resolve, reject);
        cursor++;
      }
    }
  });
}

allLimit(
  [
    () => Promise.resolve('allLimit 1'),
    () => Promise.resolve('allLimit 2'),
    () => 'allLimit 3',
    () => Promise.resolve('allLimit 4'),
    () => Promise.resolve('allLimit 5'),
    () => Promise.resolve('allLimit 6'),
  ],
  2,
)
  .then(console.log)
  .catch(console.error);
