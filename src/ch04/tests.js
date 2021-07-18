"use strict";

const { assert } = require("qunit");

const _ = require("lodash");
const R = require("ramda");

const isValid = (val) => !_.isUndefined(val) && !_.isNull(val);
const trim = (str) => str.replace(/^\s*|\s*$/g, "");
const normalize = (str) => str.replace(/\-/g, "");

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

QUnit.test("Composition", function () {
  const str = `We can only see a short distance ahead but we can see plenty there that needs to be done`;
  const explode = (str) => str.split(/\s+/);
  const count = (arr) => arr.length;
  const countWords = R.compose(count, explode);
  assert.equal(countWords(str), 19);
});

QUnit.test("More composition", function () {
  const trim = (str) => str.replace(/^\s*|\s*$/g, "");
  const normalize = (str) => str.replace(/\-/g, "");
  const validLength = (param, str) => str.length === param;
  const checkLengthSsn = _.partial(validLength, 9);
  const cleanInput = R.compose(normalize, trim);
  const isValidSsn = R.compose(checkLengthSsn, cleanInput);

  let result = cleanInput("444-44-4444");
  assert.equal(result, "444444444");

  result = isValidSsn(" 444-44-4444 ");
  assert.ok(result);
});

QUnit.test("Composition with functional libraries", function () {
  const students = ["Rosser", "Turing", "Kleene", "Church"];
  const grades = [80, 100, 90, 99];
  const smartestStudent = R.compose(
    R.head,
    R.pluck(0),
    R.reverse,
    R.sortBy(R.prop(1)),
    R.zip
  );
  const result = smartestStudent(students, grades);
  assert.equal(result, "Turing");
});

QUnit.test("Composition as point-free functions", function () {
  const students = ["Rosser", "Turing", "Kleene", "Church"];
  const grades = [80, 100, 90, 99];
  const first = R.head;
  const getName = R.pluck(0);
  const reverse = R.reverse;
  const sortByGrade = R.sortBy(R.prop(1));
  const combine = R.zip;
  const result = R.compose(first, getName, reverse, sortByGrade, combine);
  assert.equal(result(students, grades), "Turing");
});

QUnit.test("Show student program with currying and composition", function () {
  const { db } = require("../ch01/helper");
  const find = R.curry((db, id) => db.find(id));
  const findObject = R.curry(function (db, id) {
    const obj = find(db, id);
    if (obj === null) {
      throw new Error(`Object with ID [${id}] not found`);
    }
    return obj;
  });
  const findStudent = findObject(db);
  const csv = ({ ssn, firstname, lastname }) =>
    `${ssn}, ${firstname}, ${lastname}`;
  const append = R.curry(function (elementId, info) {
    console.log(info);
    return info;
  });
  const showStudent = R.compose(
    append("#student-info"),
    csv,
    findStudent,
    normalize,
    trim
  );
  const result = showStudent("44444-4444");
  assert.equal(result, "444-44-4444, Alonzo, Church");
});
