"use strict";

var tail = require('./tail')
var split = require('split')
var log = require('debug')('follow-file')

module.exports = function ff(file, options) {
  log('file', file, options)
  return tail(file, options).pipe(split())
}