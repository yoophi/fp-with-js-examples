const isObject = (obj) => obj && typeof obj === "object";

const deepFreeze = (obj) => {
  if (isObject(obj) && !Object.isFrozen(obj)) {
    Object.keys(obj).forEach((name) => deepFreeze(obj[name]));
    Object.freeze(obj);
  }
  return obj;
};

module.exports = {
	deepFreeze
}