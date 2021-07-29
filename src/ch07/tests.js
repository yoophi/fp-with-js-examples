"use strict";

QUnit.module("Chapter 7");

require("./memoization");
const now = require("performance-now");
const R = require("ramda");
const { IO } = require("../model/monad/IO");

let rot13 = ((s) =>
  s.replace(/[a-zA-Z]/g, (c) =>
    String.fromCharCode(c <= "Z" ? 90 : 122) >= (c = c.charCodeAt(0) + 13)
      ? c
      : c - 26
  )).memoize();

QUnit.test("Performance", function (assert) {
  const start = () => now();
  const runs = [];
  const end = function (start) {
    let end = now();
    let result = (end - start).toFixed(3);
    runs.push(result);
    return result;
  };
  const test = function (fn, input) {
    return () => fn(input);
  };
  const testRot13 = IO.from(start)
    .map(R.tap(test(rot13, "functinoal_js_50_off")))
    .map(end);

  testRot13.run();
  testRot13.run();
  assert.ok(runs[0] >= runs[1]);
});
