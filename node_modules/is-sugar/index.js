'use strict';

const pify = require('pify');

const f = function (cb) {
	cb(null, (process.env.DESKTOP_SESSION === 'sugar'));
};

module.exports = pify(f);
