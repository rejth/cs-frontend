// Необходимо написать функцию sleep, которая бы принимала заданное количество миллисекунд и возвращала Promise.

export function sleep(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => resolve('some data'), delay);
  });
}

sleep(100).then((_response) => {
  console.log(`I'am awake!`);
});
