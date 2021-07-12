

"use strict"

const { assert } = require("qunit")

QUnit.module('Chapter 2')

const ValueObjects = require('../model/value_objects')
const { zipCode, coordinate } = ValueObjects;

QUnit.test('Playing with immutable value objects', function() {
	let princetonZip = zipCode('08544' , '3345')
	assert.equal(princetonZip.toString(), '08544-3345')

	let greenwich = coordinate(51.4778, 0.0015)
	assert.equal(greenwich.toString(), '(51.4778,0.0015)')

	let newCoord = greenwich.translate(10, 10).toString()
	assert.equal(newCoord.toString(), '(61.4778,10.0015)')
})