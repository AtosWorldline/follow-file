"use strict";

var spawn = require('child_process').spawn

var nodeTail = require('tailing-stream').createReadStream,
  which = require('which').sync

module.exports = function tail(p, opt) {
  var options = opt || {};
  var useNode = false
  try {
    which('tail')
  }
  catch (err) {
    useNode = true
  }

  if (useNode) {
    return nodeTail(p, { timeout: false, start: options.start || 0 })
  }
  else {
    var tailc = spawn('tail', [ '-Fn', options.start || 1, p])
//    tailc.stdout.stderr = tailc.stderr
    return tailc.stdout
  }
}