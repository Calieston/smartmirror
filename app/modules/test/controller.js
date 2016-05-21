'use strict';

var jade = require('jade');

exports.get = (params) => {
  console.log(params);
  let hello = 'Hello ';

  /*
 Let html = jade.renderFile('./view.jade', {
		params: params
	});
	console.log(html);
*/

  hello += params.vorname + ' ' + params.nachname;

  return hello;
};