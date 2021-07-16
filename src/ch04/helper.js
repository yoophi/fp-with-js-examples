const R = require("ramda");
const checkType = R.curry(function (typeDef, obj) {
  if (!R.is(typeDef, obj)) {
    let type = typeof obj;
    throw new TypeError(
      `Type mismatch. Expected [${typeDef}] but found [${type}]`
    );
  }

  return obj;
});

const Tuple = function (/* types */) {
  const typeInfo = Array.prototype.slice.call(arguments, 0);
  const _T = function (/* values */) {
    const values = Array.prototype.slice.call(arguments, 0);
    if (values.some((val) => val === null || val === undefined)) {
      throw new ReferenceError("Toples may not have any null values");
    }
    if (values.length !== typeInfo.length) {
      throw new TypeError("Tuple arity does not match its prottype");
    }
    values.map((val, index) => {
      this["_" + (index + 1)] = checkType(typeInfo[index], val);
    }, this);
    Object.freeze(this);
  };
  _T.prototype.values = function () {
    return Object.keys(this).map((k) => this[k], this);
  };
  return _T;
};

module.exports = {
  checkType,
  Tuple,
};
