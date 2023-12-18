// Реализовать бинарный поиск в массиве

const res = binarySearch(4, [-432, 0, 1, 1, 2, 2, 2, 3, 4, 5, 6, 98]); // 8 - это индекс
console.log(res);

export function binarySearch(n, arr) {
  let start = 0;
  let end = arr.length - 1;

  while (start <= end) {
    let middle = Math.floor((end + start) / 2);
    const value = arr[middle];

    if (value === n) return middle;

    if (value > n) {
      end = middle - 1;
    } else if (value < n) {
      start = middle + 1;
    }
  }
}
