// Необходимо написать функцию setImmediate/clearImmediate по аналогии с node.js.
// Функция предоставляет API схожее с setTimeout, но создает микротаску, выполняясь тем самым раньше макротасок

const [setImmediate, clearImmediate] = (() => {
  const microtasks = new WeakMap();

  const setMicrotask = (fn, ...args) => {
    const key = {};
    microtasks.set(key, fn);

    queueMicrotask(() => {
      const cb = microtasks.get(key);
      if (cb && typeof cb === 'function') {
        cb(...args);
      }
    });

    return key;
  };

  const deleteMicrotask = (key) => {
    microtasks.delete(key);
  };

  return [setMicrotask, deleteMicrotask];
})();

// С помощью AbortController
function setImmediate1(fn, ...args) {
  const controller = new AbortController();
  const signal = controller.signal;

  queueMicrotask(() => {
    if (fn && !signal.aborted) {
      fn(...args);
    }
  });

  return controller;
}

function clearImmediate1(timer) {
  timer.abort();
}

setTimeout(() => console.log(3), 0);
setImmediate(() => console.log(1));
setTimeout(() => console.log(4), 0);
const timer = setImmediate(() => console.log(2));
clearImmediate(timer);
