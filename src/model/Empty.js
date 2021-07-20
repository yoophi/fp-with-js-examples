class Empty {
  map(_) {
    return this;
  }

  fmap(_) {
    return new Empty();
  }

  toString() {
    return "Empty ()";
  }
}

const empty = () => new Empty();

module.exports = {
  empty,
  Empty,
};
