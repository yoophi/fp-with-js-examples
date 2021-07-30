"use strict";

QUnit.module("Chapter 8");

QUnit.test("Generator 1", function (assert) {
  function* addGenerator() {
    var i = 0;
    while (true) {
      i += yield i;
    }
  }

  let adder = addGenerator();
  assert.equal(adder.next().value, 0);
  assert.equal(adder.next(5).value, 5);
});

QUnit.test("Generator 2", function (assert) {
  function* range(start, finish) {
    for (let i = start; i < finish; i++) {
      yield i;
    }
  }

  let r = range(0, Number.POSITIVE_INFINITY);

  assert.equal(r.next().value, 0);
  assert.equal(r.next().value, 1);
  assert.equal(r.next().value, 2);
});
