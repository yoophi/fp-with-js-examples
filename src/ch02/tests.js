"use strict";

const { assert } = require("qunit");

QUnit.module("Chapter 2");

const ValueObjects = require("../model/value_objects");
const { zipCode, coordinate } = ValueObjects;

const { Student } = require("../model/Student");
const { Address } = require("../model/Address");

QUnit.test("Playing with immutable value objects", function () {
  let princetonZip = zipCode("08544", "3345");
  assert.equal(princetonZip.toString(), "08544-3345");

  let greenwich = coordinate(51.4778, 0.0015);
  assert.equal(greenwich.toString(), "(51.4778,0.0015)");

  let newCoord = greenwich.translate(10, 10).toString();
  assert.equal(newCoord.toString(), "(61.4778,10.0015)");
});

QUnit.test("Deep freeze object", function () {
  const { deepFreeze } = require("./helper");
  let address = new Address("US");
  let student = new Student(
    "444-44-4444",
    "Joe",
    "Smith",
    "Harvard",
    1960,
    address
  );
  let frozenStudent = deepFreeze(student);

  assert.throws(() => {
    frozenStudent.firstname = "Emmet";
  }, TypeError);

	assert.throws(() => {
		frozenStudent.address.country = 'Canada'
	}, TypeError)
});
