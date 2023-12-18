export class TaskProcessor {
  #maxTimePerCallback = 100;
  #sleepTime = 100;
  #taskPool = new Set();
  #isProcessStarted = false;

  constructor(maxTime, delay) {
    this.#maxTimePerCallback = maxTime;
    this.#sleepTime = delay;
  }

  #executeTask(task) {
    this.#taskPool.add(task);
    if (this.#isProcessStarted) return;

    this.#isProcessStarted = true;
    this.#iterate();
  }

  #iterate() {
    for (const task of this.#taskPool.values()) {
      const { done, value } = task.worker.next();

      if (done) {
        this.#taskPool.delete(task);
        task.resolve('The task is done');
      }

      if (value instanceof Error) task.reject(value);

      setTimeout(() => {
        if (this.#taskPool.size > 0) {
          this.#iterate();
        } else {
          this.#isProcessStarted = false;
        }
      }, this.#sleepTime);
    }
  }

  *#createWorker(iterable, fn) {
    const iterator = iterable[Symbol.iterator]();
    let start = Date.now();
    let index = 0;

    while (true) {
      const { done, value } = iterator.next();
      if (done) return;

      if (Date.now() - start > this.#maxTimePerCallback) {
        yield 'sleep';
        start = Date.now();
      }

      try {
        fn(value, index++, iterable);
      } catch (e) {
        if (e instanceof Error) yield e;
      }
    }
  }

  forEach(iterable, priority, fn) {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('Data is not iterable');
    }
    if (typeof fn !== 'function') {
      throw new Error('Callback is not a function');
    }

    const worker = this.#createWorker(iterable, fn);

    return new Promise((resolve, reject) => {
      this.#executeTask({ worker, priority, resolve, reject });
    });
  }
}

const taskProcessor = new TaskProcessor(100, 100);
let total = 0;

taskProcessor
  .forEach(new Array(5e3).fill('Any item 1'), (item, i, _iterable) => {
    total++;
    console.log('current item 1:', item);
    console.log('index:', i);
  })
  .then((result) => {
    console.log('resolved result:', result);
  })
  .catch(console.error);

taskProcessor
  .forEach(new Array(5e3).fill('Any item 2'), (item, i, _iterable) => {
    total++;
    console.log('current item 2:', item);
    console.log('index:', i);
  })
  .then((result) => {
    console.log('resolved result:', result);
  })
  .catch(console.error);

console.log('SYNC TASK TOTAL: ', total);
