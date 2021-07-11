"use strict";

const R = require("ramda");
const _ = require("lodash");

describe("Chapter 1", function () {
  const run = R.compose;

  test("Listing 1.1 Functional printMessage", function () {
    const echo = R.identity;
    const toUpperCase = (str) => str.toUpperCase();
    const printToConsole = (str) => {
      console.log(str);
      return str;
    };

    const printMessage = run(printToConsole, toUpperCase, echo);
    expect(printMessage("Hello World")).toEqual("HELLO WORLD");
  });

  test("Listing 1.2 Extending printMessage", function () {
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
    expect(printMessage("Hello World")).toEqual(
      "HELLO WORLD HELLO WORLD HELLO WORLD"
    );
  });

  test("List 1.3 Imperative showStudent function with side effects", function () {
    const db = require("../helper").db;

    function showStudent(ssn) {
      let student = db.find(ssn);
      if (student !== null) {
        let studentInfo = `<p>${student.ssn},${student.firstname},${student.lastname}</p>`;
        console.log(studentInfo);
        return studentInfo;
      } else {
        throw new Error("Student not found.");
      }
    }

    expect(showStudent("444-44-4444")).toEqual(
      "<p>444-44-4444,Alonzo,Church</p>"
    );
  });

  const curry = R.curry;

  test("Listing 1.4 Decomposing the showStudent progran", function () {
    const db = require("../helper").db;

    const find = curry((db, id) => {
      let obj = db.find(id);
      if (obj === null) {
        throw new Error("Object now found.");
      }
      return obj;
    });

    const csv = (student) =>
      `${student.ssn},${student.firstname},${student.lastname}`;

    const append = curry((source, info) => {
      source(info);
      return info;
    });

    const showStudent = run(append(console.log), csv, find(db));

    expect(showStudent("444-44-4444")).toEqual("444-44-4444,Alonzo,Church");
  });

  test("Listing 1.5 Programming with function chains", function () {
    const enrollments = [
      { enrolled: 3, grade: 90 },
      { enrolled: 1, grade: 100 },
      { enrolled: 1, grade: 87 },
    ];

    const result = _.chain(enrollments)
      .filter((student) => student.enrolled > 1)
      .map(_.property("grade"))
      .mean()
      .value();

    console.log(result);

    expect(result).toEqual(90);
  });
});
