"use strict";

QUnit.module("Chapter 6");

const R = require("ramda");
const fork = (join, func1, func2) => (val) => join(func1(val), func2(val));

QUnit.test("Compute Average Grade", function (assert) {
  const toLetterGrade = (grade) => {
    if (grade >= 90) return "A";
    if (grade >= 80) return "B";
    if (grade >= 70) return "C";
    if (grade >= 60) return "D";
    return "F";
  };
  const computedAverageGrade = R.compose(
    toLetterGrade,
    fork(R.divide, R.sum, R.length)
  );
  assert.equal(computedAverageGrade([80, 90, 100]), "A");
});
