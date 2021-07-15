"use strict";

QUnit.module("Chapter 3");

const _ = require("lodash");
const { assert } = require("qunit");
const R = require("ramda");

const { Person } = require("../model/Person");
const { Address } = require("../model/Address");

const p1 = new Person(
  "111-11-1111",
  "Haskell",
  "Curry",
  1900,
  new Address("US")
);
const p2 = new Person(
  "222-22-2222",
  "Barkley",
  "Rosser",
  1907,
  new Address("Greece")
);
const p3 = new Person(
  "333-33-3333",
  "John",
  "von Neumann",
  1903,
  new Address("Hungary")
);
const p4 = new Person(
  "444-44-4444",
  "Alonzo",
  "Church",
  1903,
  new Address("US")
);

const persons = [p1, p2, p3, p4];

QUnit.test("Understanding reduce", function () {
  let result = _(persons).reduce((stat, person) => {
    const country = person.address.country;
    stat[country] = _.isUndefined(stat[country]) ? 1 : stat[country] + 1;

    return stat;
  }, {});

  assert.deepEqual(result, {
    US: 2,
    Greece: 1,
    Hungary: 1,
  });
});

QUnit.test("Combining map and reduce", function () {
  const getCountry = (person) => person.address.country;
  const gatherStats = (stat, criteria) => {
    stat[criteria] = _.isUndefined(stat[criteria]) ? 1 : stat[criteria] + 1;

    return stat;
  };
  let result = _(persons).map(getCountry).reduce(gatherStats, {});

  assert.deepEqual(result, {
    US: 2,
    Greece: 1,
    Hungary: 1,
  });
});

QUnit.test("Combining map and reduce with lenses", function () {
  const cityPath = ["address", "country"];
  const cityLens = R.lens(R.path(cityPath), R.assocPath(cityPath));
  const gatherStats = (stat, criteria) => {
    stat[criteria] = _.isUndefined(stat[criteria]) ? 1 : stat[criteria] + 1;
    return stat;
  };

  let result = _(persons).map(R.view(cityLens)).reduce(gatherStats, {});
  assert.deepEqual(result, {
    US: 2,
    Greece: 1,
    Hungary: 1,
  });
});

QUnit.test("Valid or not valid", function () {
  const isNotValid = (val) => _.isUndefined(val) || _.isNull(val);
  const notAllValid = (args) => _(args).some(isNotValid);
  assert.ok(notAllValid(["string", 0, null, undefined]));
  assert.ok(!notAllValid(["string", 0, {}]));

  const isValid = (val) => !_.isUndefined(val) && !_.isNull(val);
  const allValid = (args) => _(args).every(isValid);
  assert.ok(!allValid(["string", 0, null]));
  assert.ok(allValid(["string", 0, {}]));
});

QUnit.test("Introducing filter", function () {
  const isValid = (val) => !_.isUndefined(val) && !_.isNull(val);
  const getFullname = (person) => person.fullname;
  let result = _([p1, p2, p3, null]).filter(isValid).map(getFullname).value();
  assert.equal(result.length, 3);
});

QUnit.test("People born in 1903", function () {
  const bornIn1903 = (person) => person.birthYear === 1903;
  const getFullname = (person) => person.fullname;
  let result = _(persons).filter(bornIn1903).map(getFullname).join(" and ");
  assert.equal(result, "John von Neumann and Alonzo Church");
});
