"use strict";

const { assert } = require("qunit");

const _ = require("lodash");

const isValid = (val) => !_.isUndefined(val) && !_.isNull(val);

QUnit.module("Chapter 4");

QUnit.test("Chaining methods together", function () {
  const names = [
    "alonzo church",
    "Haskell curry",
    "stephen_kleene",
    "John Von Neumann",
    "stephen_kleene",
  ];
  const result = _.chain(names)
    .filter(isValid)
    .map((s) => s.replace(/_/, " "))
    .uniq()
    .map(_.startCase)
    .sort()
    .value();
  assert.deepEqual(result, [
    "Alonzo Church",
    "Haskell Curry",
    "John Von Neumann",
    "Stephen Kleene",
  ]);
});

QUnit.test("Check Type tests", function () {
  const { checkType } = require("./helper");
  assert.equal(checkType(String)("Curry"), "Curry");
  assert.equal(checkType(Number)(3), 3);
  assert.equal(checkType(Number)(3.5), 3.5);
  let now = new Date();
  assert.equal(checkType(Date)(now), now);
  assert.deepEqual(checkType(Object)({}), {});
  assert.throws(() => {
    checkType(String)(42);
  }, TypeError);
});
