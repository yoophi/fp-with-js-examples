var Person = require("../model/Person").Person;

var _students = {
  "444-44-4444": new Person("444-44-4444", "Alonzo", "Church"),
  444444444: new Person("444-44-4444", "Alonzo", "Church"),
};

module.exports = {};

module.exports.db = {
  find: function (ssn) {
    return _students[ssn];
  },
};
