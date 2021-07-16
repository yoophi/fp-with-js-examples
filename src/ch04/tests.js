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

QUnit.test("Tuple test", function () {
  const { Tuple } = require("./helper");
  const StringPair = Tuple(String, String);
  const name = new StringPair("Barkley", "Rosser");
  let [first, last] = name.values();
  assert.equal(first, "Barkley");
  assert.equal(last, "Rosser");
});

QUnit.test("Extending the core language", function () {
  String.prototype.first = _.partial(String.prototype.substring, 0, _);
  let result = "Functional Programming".first(3);
  assert.equal(result, "Fun");

  String.prototype.asName = _.partial(
    String.prototype.replace,
    /(\w+)\s(\w+)/,
    "$2, $1"
  );
  result = "Alonzo Church".asName();
  assert.equal(result, "Church, Alonzo");

  String.prototype.explode = _.partial(String.prototype.match, /[\w]/gi);
  result = "ABC".explode();
  assert.deepEqual(result, ["A", "B", "C"]);

  String.prototype.parseUrl = _.partial(
    String.prototype.match,
    /(http[s]?|ftp):\/\/([^:\/\s]+)\.([^:\/\s]{2,5})/
  );
  result = "http://example.com".parseUrl();
  assert.deepEqual(result, ["http://example.com", "http", "example", "com"]);
});
