// Необходимо написать регулярное выражение, которое при вызове test на строке будет давать false, если в строке есть символы отличные от латинских, цифр, подчеркивания и знака $
console.log(/[a-zA-z0-9_$]/.test('привет')); // false

// Необходимо создать массив на основе строки, где раздилителем будут символы . , ; или пробелы (подряд идущие пробелы считаются за один)
const myRegExp = /\s+|[.,;]/;
console.log('foo    bla.bar,gd;4'.split(myRegExp)); // ['foo', 'bla', 'bar', 'gd', '4']

// Необходимо написать функцию, которая принимает строковый шаблон и объект параметров, и возвращает результат применения данных к этому шаблону
const reg = /(\${)([a-zA-z]+)}/;
const regGlobal = /(\${)([a-zA-z]+)}/g;
const str = 'Hello, ${user}! Your age is ${age}.';

function format(str, obj) {
  const replacer = (_match, _$1, $2) => `${obj[$2]}`;
  return str.replaceAll(regGlobal, replacer);
}

const result = format(str, {
  user: 'Bob',
  age: 10,
});

console.log('result: ', result); // Hello, Bob! Your age is 10.

console.log('test: ', reg.test(str));
console.log('exec: ', reg.exec(str));

console.log('match: ', str.match(reg));
console.log('matchAll: ', [...str.matchAll(regGlobal)]);

console.log('replace: ', str.replace(reg, 'Bob'));
console.log('replaceAll: ', str.replaceAll(regGlobal, 'Bob'));

// Необходимо написать регулярное выражение, которое бы удаляла из строки любые дублирования подстрок из 1-го, 2-х или 3-х символов, которые идут подряд
function zipStr1(str) {
  const zippedStr = str.replace(/(.+)\1+/g, '$1');
  if (zippedStr === str) return zippedStr;
  return zipStr1(zippedStr);
}
function zipStr2(str) {
  return str.replaceAll(/(.+)(?=\1)/g, '');
}

console.log(zipStr2('aaaabbbbczzzz')); // 'abcz'
console.log(zipStr2('abababbbabcabc')); // abbabc' (3 ab -> ab, 2 b -> b, 2 abc -> abc)
console.log(zipStr2('foofoobabaaaazze')); // 'foobaaze' (2 foo -> foo, 2 ba -> ba, 3 a -> a, 2 z -> z, e)
console.log('foofoobabaaaazze'.replaceAll(/(.+)\1+/g, '$1')); // 'foobaaze'

// Нахождение арифметических операций в строке и замена на результат
function calc(str) {
  const regExp = /(?<![a-za-яё])([()\s\d\+\-\*\/]+)(?![a-za-яё])/g;
  const replacer = (_match, $1) => `${eval($1)}`;
  return str.replaceAll(regExp, replacer);
}

console.log(calc(`Какой-то текст (10 + 15 - 24) ** 2. Еще какой то текст 2 * 10`));
