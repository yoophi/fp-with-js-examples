class Wrapper {
  constructor(value) {
    this._value = value;
  }

  map(f) {
    return f(this._value);
  }

  fmap(f) {
    return new Wrapper(f(this._value));
  }

  toString() {
    return `Wrapper(${this._value})`;
  }
}

const wrap = (val) => new Wrapper(val);

module.exports = {
  wrap,
  Wrapper,
};
