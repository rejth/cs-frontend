const asyncIterable = {
  async *[Symbol.asyncIterator]() {
    for (let i = 0; i <= 10; i++) {
      await new Promise((resolve) => setTimeout(resolve, 50));
      yield i;
    }
  },
};

(async () => {
  for await (let value of asyncIterable) {
    console.log(value);
  }
})();

async function* take(iterable, count) {
  if (typeof iterable[Symbol.asyncIterator] !== 'function') {
    throw new Error('The object does not have asynchronous iterator');
  }

  const asyncIterator = iterable[Symbol.asyncIterator]();
  let cursor = 0;

  while (count !== cursor++) {
    const { value } = await asyncIterator.next();
    yield value;
  }
}

async function* seq(...iterables) {
  for (const item of iterables) {
    for await (const element of item) {
      yield* element;
    }
  }
}

async function* watch(executors) {
  const asyncIterables = executors.map((exec) => exec());

  for await (const value of seq(asyncIterables)) {
    yield value;
  }
}

const watcher = watch([() => asyncIterable, () => asyncIterable]);

(async () => {
  for await (const item of watcher) {
    console.log(item);
  }
})();

async function* filter(iterable, onFilter) {
  if (typeof iterable[Symbol.asyncIterator] !== 'function') {
    throw new Error('The object does not have asynchronous iterator');
  }

  const asyncIterator = iterable[Symbol.asyncIterator]();

  while (true) {
    const { done, value } = await asyncIterator.next();
    if (done) return;
    if (onFilter(value)) yield value;
  }
}

(async () => {
  for await (const item of filter(asyncIterable, (el) => el > 3)) {
    console.log(item);
  }
})();
