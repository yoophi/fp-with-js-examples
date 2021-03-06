"use strict";

const { assert } = require("qunit");
const R = require("ramda");

const { wrap } = require("../model/Wrapper");
const { empty } = require("../model/Empty");
const { Maybe, Nothing } = require("../model/monad/Maybe");
const { Student } = require("../model/Student");
const { Address } = require("../model/Address");
const { Person } = require("../model/Person");
const { Left, Either } = require("../model/monad/Either");
const { IO } = require("../model/monad/IO");

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

QUnit.test("Simple find with wrapper", function () {
  const { db } = require("../ch01/helper");
  const find = R.curry((db, id) => db.find(id));
  const findStudent = R.curry((db, ssn) => wrap(find(db, ssn)));
  const getAddress = (student) => wrap(student.fmap(R.prop("firstname")));
  const studentAddress = R.compose(getAddress, findStudent(db));

  assert.deepEqual(studentAddress("444-44-4444"), wrap(wrap("Alonzo")));
});

QUnit.test("Simple empty container", function () {
  const isEven = (n) => Number.isFinite(n) && n % 2 === 0;
  const half = (val) => (isEven(val) ? wrap(val / 2) : empty());
  assert.deepEqual(half(4), wrap(2));
  assert.deepEqual(half(3), empty());
});

QUnit.test("Simple empty container 2", function () {
  const { Wrapper: WrapperMonad } = require("../model/monad/Wrapper");

  const result = WrapperMonad.of("Hello Monads!")
    .map(R.toUpper)
    .map(R.identity);

  assert.deepEqual(result, WrapperMonad.of("HELLO MONADS!"));
});

QUnit.test("Simple Maybe Test", function () {
  let result = Maybe.of("Hello Maybe!").map(R.toUpper);
  assert.deepEqual(result, Maybe.of("HELLO MAYBE!"));

  result = Maybe.fromNullable(null);
  assert.deepEqual(result, new Nothing(null));
});

QUnit.test("Maybe to extract a nested property in object graph", function () {
  let address = new Address("US");
  let student = new Student(
    "444-44-4444",
    "Joe",
    "Smith",
    "Harvard",
    1960,
    address
  );

  const getCountry = (student) =>
    student
      .map(R.prop("address"))
      .map(R.prop("country"))
      .getOrElse("Country does not exsist");

  assert.equal(getCountry(Maybe.fromNullable(student)), address.country);
});

QUnit.test(
  "Maybe to extract a missing nested porperty in object graph",
  function () {
    let student = new Student(
      "444-44-4444",
      "Joe",
      "Smith",
      "Harvard",
      1960,
      null
    );

    const getCountry = (student) =>
      student
        .map(R.prop("address"))
        .map(R.prop("country"))
        .getOrElse("Country does not exist!");

    assert.equal(
      getCountry(Maybe.fromNullable(student)),
      "Country does not exist!"
    );
  }
);

QUnit.test("Simple Either monad test", function () {
  const { db } = require("../ch01/helper");
  const find = R.curry((db, id) => db.find(id));
  const safeFindObject = R.curry(function (db, id) {
    const obj = find(db, id);
    return obj
      ? Either.of(obj)
      : Either.left(`Object not found with ID: ${id}`);
  });
  const findStudent = safeFindObject(db);

  const result1 = findStudent("444-44-4444").getOrElse(new Student());
  assert.deepEqual(result1, new Person("444-44-4444", "Alonzo", "Church"));

  const result2 = findStudent("xxx-xx-xxxx");
  assert.deepEqual(
    result2,
    Either.left(`Object not found with ID: xxx-xx-xxxx`)
  );
  assert.throws(() => {
    console.log(result2.value);
  }, TypeError);
});

const { db } = require("../ch01/helper");
const { isObject } = require("lodash");
const validLength = (len, str) => str.length === len;
const find = R.curry((db, id) => db.find(id));
const safeFindObject = R.curry((db, id) => {
  const val = find(db, id);
  return val
    ? Either.right(val)
    : Either.left(`Object not found with ID: ${id}`);
});
const checkLengthSsn = (ssn) =>
  validLength(9, ssn) ? Either.right(ssn) : Either.left("invalid SSN");
const findStudent = safeFindObject(db);
const csv = (arr) => arr.join(",");
const trim = (str) => str.replace(/^\s*|\s*$/g, "");
const normalize = (str) => str.replace(/-/g, "");
const cleanInput = R.compose(normalize, trim);

QUnit.test("Using Either in show Student", function () {
  const showStudent = (ssn) =>
    Maybe.fromNullable(ssn)
      .map(cleanInput)
      .chain(checkLengthSsn)
      .chain(findStudent)
      .map(R.props(["ssn", "firstname", "lastname"]))
      .map(csv)
      .map(R.tap(console.log));
  let result = showStudent("xxx-xx-xxxx").getOrElse("Student not found!");
  assert.equal(result, "Student not found!");
});

QUnit.test("Monads as programmable commas", function () {
  const map = R.curry((f, container) => container.map(f));
  const chain = R.curry((f, container) => container.chain(f));
  const lift = R.curry((f, obj) => Maybe.fromNullable(f(obj)));
  const trace = R.curry((msg, obj) => console.log(msg));
  const showStudent = R.compose(
    R.tap(trace("student printed to the console")),
    map(R.tap(console.log)),
    R.tap(trace("Student info converted to CSV")),
    map(csv),
    map(R.props(["ssn", "firstname", "lastname"])),
    R.tap(trace("Recored fetched successfully!")),
    chain(findStudent),
    R.tap(trace("Input was valid")),
    chain(checkLengthSsn),
    lift(cleanInput)
  );
  let result = showStudent("444-44-4444").getOrElse("Student not found!");
  assert.equal(result, "444-44-4444,Alonzo,Church");
});

QUnit.test("Complete showStudent program", function () {
  const map = R.curry((f, container) => container.map(f));
  const chain = R.curry((f, container) => container.chain(f));
  const lift = R.curry((f, obj) => Maybe.fromNullable(f(obj)));
  const liftIO = (val) => IO.of(val);
  const append = R.curry(function (elementId, info) {
    console.log(`Simulating effect. Appending ${info}`);
    return info;
  });
  const getOrElse = R.curry((message, container) =>
    container.getOrElse(message)
  );

  const showStudent = R.compose(
    map(append("#student-info")),
    liftIO,
    getOrElse("unable to find student"),
    map(csv),
    map(R.props(["ssn", "firstname", "lastname"])),
    chain(findStudent),
    chain(checkLengthSsn),
    lift(cleanInput)
  );
  let result = showStudent("444-44-4444").run();
  assert.equal(result, "444-44-4444,Alonzo,Church");
  let result2 = showStudent("xxx-xx-xxxx").run();
  assert.equal(result2, "unable to find student");
});
