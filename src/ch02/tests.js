"use strict";

const { assert } = require("qunit");

QUnit.module("Chapter 2");

const R = require("ramda");

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
    frozenStudent.address.country = "Canada";
  }, TypeError);
});

QUnit.test("Playing with Lenses", function () {
  let z = zipCode("08544", "1234");
  let address = new Address("US", "NJ", "Princeton", z, "Alexander St.");
  let student = new Student(
    "444-44-4444",
    "Joe",
    "Smith",
    "Princeton University",
    1960,
    address
  );

  let zipPath = ["address", "zip"];
  const zipLens = R.lensPath(zipPath);
  console.log({ out: student.address, x: student.address.zip.toString() });
  assert.deepEqual(R.view(zipLens, student), z);

  let beverlyHills = zipCode("90210", "5678");
  let newStudent = R.set(zipLens, beverlyHills, student);
  assert.deepEqual(R.view(zipLens, newStudent).code(), beverlyHills.code());
  assert.deepEqual(R.view(zipLens, student), z);
  assert.ok(newStudent !== student);
});

QUnit.test('Negation', function() {
  function negate(func) {
    return function() {
      return !func.apply(null, arguments)
    }
  }

  function isNull(val) {
    return val === null
  }

  let isNotNull = negate(isNull)
  assert.ok(!isNotNull(null))
  assert.ok(isNotNull({}))
})