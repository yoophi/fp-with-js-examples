const { Person } = require("./Person");

class Student extends Person {
  constructor(
    ssn,
    firstname,
    lastname,
    school,
    birthYear = null,
    address = null
  ) {
    super(ssn, firstname, lastname, birthYear, address);
    this._school = school;
  }

  get school() {
    return this._school;
  }
}

module.exports = { Student };
