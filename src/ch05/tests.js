"use strict";

const { assert } = require("qunit");
const R = require("ramda");

const { wrap } = require("../model/Wrapper");

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
