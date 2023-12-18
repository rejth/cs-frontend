// Необходимо создать монадический контейнер Result с двумя состояниями Error и Ok.
// Контейнер должен обладать характеристиками монады и функтора.

export class Result {
  data = null;
  error = null;
  isError = false;

  constructor(callback) {
    try {
      const result = callback();

      if (result instanceof Result) {
        this.isError = result.isError;
        this.error = result.error;
        if (!this.isError) this.data = this.unwrap();
      } else {
        this.isError = false;
        this.error = null;
        this.data = result;
      }
    } catch (e) {
      this.isError = true;
      this.error = e;
    }
  }

  get isError() {
    return this.data instanceof Error;
  }

  unwrap() {
    if (this.isError) throw new Error('Error occured');
    return this.data;
  }

  then(fn) {
    return new Result(() => {
      if (this.isError) throw this.error;
      return fn(this.data);
    });
  }

  catch(fn) {
    return new Result(() => {
      if (this.isError) fn(this.error);
      return this.data;
    });
  }
}

const result = new Result(() => 10);

result
  .then((el) => el * 2)
  .then((el) => el * 12)
  .then((el) => {
    throw 'error';
  })
  .catch(console.log);
