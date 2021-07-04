'use strict';

var isCinnamon = require('is-cinnamon');
var isGnome = require('is-gnome');
var isKde = require('is-kde');
var isLxde = require('is-lxde');
var isMate = require('is-mate');
var isSugar = require('is-sugar');
var isUnity = require('is-unity');
var isXfce = require('is-xfce');
var pify = require('pify');

module.exports = pify(function (cb) {
	if (process.platform === 'linux' || process.platform === 'freebsd') {
		var de = 'N/A';
		var desktopChecks = [isCinnamon(), isGnome(), isKde(), isLxde(), isMate(), isSugar(), isUnity(), isXfce()];

		Promise.all(desktopChecks).then(function (values) {
			var desktopNames = ['Cinnamon', 'Gnome', 'KDE', 'LXDE', 'Mate', 'Sugar', 'Unity', 'XFCE'];
			values.map(function (v, k) {
				if (v === true) {
					de = desktopNames[k];
				}
				return de;
			});
			cb(null, de);
		}).catch(function (err) {
			cb(err, null);
		});
	}

	if (process.platform === 'win32') {
		cb(null, 'Aero');
	}

	if (process.platform === 'darwin') {
		cb(null, 'Aqua');
	}
});
