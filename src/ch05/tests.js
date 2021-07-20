"use strict";

const { assert } = require("qunit");
const R = require("ramda");

const { wrap } = require("../model/Wrapper");

QUnit.module("Chapter 5");

QUnit.test("Simple Wrapper test", function () {
  const wrappedValue = wrap("Get Functional");
  assert.equal(wrappedValue.map(R.identity), "Get Functional");
});
