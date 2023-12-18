export class Structure {
  constructor(array) {
    if (!array.length) {
      throw new Error('Keys are not defined');
    }

    this.expression = `
      switch (key) {
        {cases}
        default:
          throw new Error('Key not defined')
      }
    `;

    let cases = '';
    for (const key of array) {
      cases += this.getCaseExpression(key);
    }

    this.expression = this.expression.replaceAll(/\{cases\}/g, cases);
  }

  getCaseExpression(key, value = null) {
    const keyAsString = `'${key}'`;
    return `case ${keyAsString}: return '${value}';\n`;
  }

  get(key) {
    return Function('key', this.expression)(key);
  }

  set(key, value) {
    const keyAsString = `'${key}'`;
    const regular = new RegExp(`case\\s${keyAsString}:\\sreturn\\s(.+);`, 'g');
    const newCase = this.getCaseExpression(key, value);

    if (!regular.test(this.expression)) {
      throw new Error('Key is not defined');
    }

    this.expression = this.expression.replaceAll(regular, newCase);
  }
}

const jackBlack = new Structure(['name', 'lastName', 'age']);

jackBlack.set('name', 'Jack');
jackBlack.set('lastName', 'Black');
jackBlack.set('age', 53);

console.log(jackBlack.get('name')); // 'Jack'
