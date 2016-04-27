"use strict";

var chai = require('chai');
var assert = chai.assert;


describe('Example', function () {
	var str = "123456789";

	it('string sollte 123834ß69', function (done) {
		assert.equal(str, "123456789");
		done();
	});
	it('string sollte ein string sein', function (done) {
		assert.typeOf(str, 'String');
		done();
	});
});

""
''
function function_name(argument) {
	// body...
}
