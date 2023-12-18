// Необходимо написать функцию timeout, которая бы принимала Promise и заданное количество миллисекунд и возвращала Promise.

export function timeout(promise, delay) {
  return new Promise(async (resolve, reject) => {
    let result, error;
    try {
      result = await promise;
    } catch (e) {
      error = e;
    }

    setTimeout(() => {
      if (result) resolve(result);
      if (error) reject(error);
    }, delay);
  });
}

// Через 200 мс Promise будет зареджекчен
const fakeFetch = Promise.reject('some data');
timeout(fakeFetch, 1000).then(console.log).catch(console.error);
