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

module.exports = {
  checkType,
};
