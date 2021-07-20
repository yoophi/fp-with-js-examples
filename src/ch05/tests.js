"use strict";

const { assert } = require("qunit");
const R = require("ramda");

const { wrap } = require("../model/Wrapper");
const { empty } = require("../model/Empty");

QUnit.module("Chapter 5");

QUnit.test("Simple Wrapper test", function () {
  const wrappedValue = wrap("Get Functional");
  assert.equal(wrappedValue.map(R.identity), "Get Functional");
});

QUnit.test("Simple functor test", function () {
  const plus = R.curry((a, b) => a + b);
  const plus3 = plus(3);
  const plus10 = plus(10);
  const two = wrap(2);
  const five = two.fmap(plus3);
  assert.equal(five.map(R.identity), 5);
  assert.equal(two.fmap(plus3).fmap(plus10).map(R.identity), 15);
});

QUnit.test("Simple find with wrapper", function () {
  const { db } = require("../ch01/helper");
  const find = R.curry((db, id) => db.find(id));
  const findStudent = R.curry((db, ssn) => wrap(find(db, ssn)));
  const getAddress = (student) => wrap(student.fmap(R.prop("firstname")));
  const studentAddress = R.compose(getAddress, findStudent(db));

  assert.deepEqual(studentAddress("444-44-4444"), wrap(wrap("Alonzo")));
});

QUnit.test("Simple empty container", function () {
  const isEven = (n) => Number.isFinite(n) && n % 2 === 0;
  const half = (val) => (isEven(val) ? wrap(val / 2) : empty());
  assert.deepEqual(half(4), wrap(2));
  assert.deepEqual(half(3), empty());
});
