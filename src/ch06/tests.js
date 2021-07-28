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

QUnit.test("Functional Combinator: fork", function (assert) {
  const timesTwo = fork((x) => x + x, R.identity, R.identity);
  assert.equal(timesTwo(1), 2);
  assert.equal(timesTwo(2), 4);
});

QUnit.test("showStudent: cleanInput", function (assert) {
  const trim = (str) => str.replace(/^\s*|\s*$/g, "");
  const normalize = (str) => str.replace(/-/g, "");
  const cleanInput = R.compose(normalize, trim);

  const input = ["", "-44-44-", " 4 ", " 4-4 "];
  const assertions = ["", "4444", "4", "44"];
  assert.expect(input.length);
  input.forEach(function (val, key) {
    assert.equal(cleanInput(val), assertions[key]);
  });
});
