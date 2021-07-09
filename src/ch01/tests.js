"use strict";

const R = require("ramda");
const _ = require("lodash");
const { assert } = require("qunit");

QUnit.module("Chapter 1");

const run = R.compose;

QUnit.test("Listing 1.1 Functional printMessage", function () {
  const echo = R.identity;
  const toUpperCase = (str) => str.toUpperCase();
  const printToConsole = (str) => {
    console.log(str);
    return str;
  };

  const printMessage = run(printToConsole, toUpperCase, echo);
  https: assert.equal(printMessage("Hello World"), "HELLO WORLD");
});

QUnit.test("Listing 1.2 Extending printMessage", function () {
  const echo = R.identity;
  const toUpperCase = (str) => str.toUpperCase();
  const repeat = (times) => {
    return function (str = "") {
      let tokens = [];
      for (let i = 0; i < times; i++) {
        tokens.push(str);
      }
      return tokens.join(" ");
    };
  };
  const printToConsole = (str) => {
    console.log(str);
    return str;
  };
  const printMessage = run(printToConsole, repeat(3), toUpperCase, echo);
  assert.equal(
    printMessage("Hello World"),
    "HELLO WORLD HELLO WORLD HELLO WORLD"
  );
});
