// Необходимо написать класс SyncPromise, аналогичный нативному, но работающий синхронно, если это возможно.

export class SyncPromise {
  value = null;
  reason = null;
  isError = false;

  constructor(fn) {
    try {
      const resolve = (value) => this.#resolve(value);
      const reject = (reason) => this.#reject(reason);
      fn(resolve, reject);
    } catch (e) {
      this.reason = e;
      this.value = null;
      this.isError = true;
    }
  }

  #resolve(value) {
    this.value = value;
    this.reason = null;
    this.isError = false;
    return this;
  }

  #reject(reason) {
    this.reason = reason;
    this.isError = true;
    this.value = null;
    return this;
  }

  static resolve(value) {
    if (value instanceof SyncPromise) return value;
    return new SyncPromise((resolve) => {
      resolve(value);
    });
  }

  static reject(reason) {
    return new SyncPromise((_, reject) => {
      reject(reason);
    });
  }

  static all(iterable) {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('The function argument is not iterable');
    }

    const tasks = Array.from(iterable);
    if (tasks.length === 0) return SyncPromise.resolve([]);

    return new SyncPromise((resolve, reject) => {
      const results = new Array(tasks.length);
      let done = 0;

      tasks.forEach((_, i) => {
        tasks[i] = SyncPromise.resolve(tasks[i]);

        tasks[i]
          .then((value) => {
            results[i] = value;
            done++;
            if (done === tasks.length) resolve(results);
          })
          .catch((reason) => reject(reason));
      });
    });
  }

  static allSettled(iterable) {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('The function argument is not iterable');
    }

    const tasks = Array.from(iterable);
    if (tasks.length === 0) return SyncPromise.resolve([]);

    return new SyncPromise((resolve) => {
      const results = new Array(tasks.length);
      let done = 0;

      tasks.forEach((_, i) => {
        tasks[i] = SyncPromise.resolve(tasks[i]);

        tasks[i]
          .then((value) => {
            results[i] = { status: 'fulfilled', value };
            done++;
            if (done === tasks.length) resolve(results);
          })
          .catch((reason) => {
            results[i] = { status: 'rejected', reason };
            done++;
            if (done === tasks.length) resolve(results);
          });
      });
    });
  }

  static race(iterable) {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('The function argument is not iterable');
    }

    const tasks = Array.from(iterable);
    if (tasks.length === 0) return SyncPromise.resolve([]);

    return new SyncPromise((resolve, reject) => {
      for (let i = 0; i < tasks.length; i++) {
        // TODO: fix
        SyncPromise.resolve(tasks[i]).then(resolve, reject);
      }
    });
  }

  static any(iterable) {
    if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('The function argument is not iterable');
    }

    const tasks = Array.from(iterable);
    if (tasks.length === 0) return SyncPromise.resolve([]);

    return new SyncPromise((resolve, reject) => {
      const errors = new Array(tasks.length);
      let errorCount = 0;
      let result = null;

      for (let i = 0; i < tasks.length; i++) {
        tasks[i] = SyncPromise.resolve(tasks[i]);

        tasks[i]
          .then((value) => {
            if (result) resolve(result); // TODO: fix
            result = value;
          })
          .catch((reason) => {
            errorCount++;
            errors[i] = reason;
            if (errorCount === errors.length) reject(errors);
          });
      }
    });
  }

  then(onResolve, onReject) {
    return new SyncPromise((resolve) => {
      if (this.isError) throw this.reason;
      resolve(onResolve(this.value));
    });
  }

  catch(onReject) {
    return new SyncPromise((_, reject) => {
      if (this.isError) reject(onReject(this.reason));
      return this.value;
    });
  }

  finally() {
    return this;
  }
}

const syncPromise = new SyncPromise((resolve, reject) => {
  resolve('sync data');
});

console.log('data: ', syncPromise.value);
console.log('error: ', syncPromise.reason);

syncPromise
  .then((data) => `${data} enriched`)
  .then((data) => console.log('resolved data: ', data))
  .catch((e) => console.log('catched error: ', e));

SyncPromise.resolve(1)
  .then((data) => `${data} enriched`)
  .then((data) => console.log('resolved data: ', data))
  .catch((e) => console.log('catched error: ', e));

console.log(2);

SyncPromise.all([SyncPromise.resolve(3), SyncPromise.resolve(4), 5])
  .then(console.log)
  .catch(console.log);

SyncPromise.allSettled([SyncPromise.resolve(3), SyncPromise.resolve(4), 5])
  .then(console.log)
  .catch(console.log);

SyncPromise.any([SyncPromise.resolve(3), SyncPromise.resolve(4)]) // TODO: fix
  .then(console.log)
  .catch(console.log);

SyncPromise.race([SyncPromise.resolve(3), SyncPromise.resolve(4)]) // TODO: fix
  .then(console.log)
  .catch(console.log);
