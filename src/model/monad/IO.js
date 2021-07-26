const _ = require("lodash");

class IO {
  constructor(effect) {
    if (!_.isFunction(effect)) {
      throw "IO Usage: function required";
    }
    this.effect = effect;
  }

  static of(a) {
    return new IO(() => a);
  }

  static from(fn) {
    return new IO(fn);
  }

  map(fn) {
    return new IO(() => fn(this.effect()));
  }

  chain(fn) {
    return fn(this.effect());
  }

  run() {
    return this.effect();
  }
}

module.exports = {
  IO,
};
