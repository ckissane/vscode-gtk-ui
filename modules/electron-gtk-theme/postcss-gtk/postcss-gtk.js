module.paths=(module.paths||[]).concat([__dirname+'/../../node_modules/'])
const postcss = require('postcss');
require("./fix-ugly-functions");
const imports = require('postcss-import');
const fixFontDeclarations = require('./fix-font-declarations');
const colorFunctions = require('./color-functions');
colorFunctions();
const gtkColorVariables = require('./color-variables');
const gtkPseudoClasses = require('./psuedo-classes');
const valueHook = require('./value-hook');

module.exports = postcss([imports(), fixFontDeclarations, gtkColorVariables, gtkPseudoClasses, valueHook])
