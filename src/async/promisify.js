// Необходимо написать функцию promisify, которая бы принимала функцию, где последний аргумент thunk-callback и возвращала бы новую функцию. Новая функция вместо thunk-callback будет возвращать Promise.

function readFile(file, cb) {
  return cb(null, 'fileContent');
}

export function promisify(fn) {
  return (...args) =>
    new Promise(async (resolve, reject) => {
      if (fn.length !== args.length)
        throw new Error('The number of arguments is not equal to the number expected by the function');

      try {
        const result = await fn(...args);
        resolve(result);
      } catch (e) {
        reject(e);
      }
    });
}

const readFilePromise = promisify(readFile);
readFilePromise('my-file.txt', (_error, result) => result)
  .then(console.log)
  .catch(console.error);
