"use strict";
var path = require('path')
var fs = require('fs')
var expect = require('chai').expect
var log = require('debug')('test')

var ff = require('../index.js')

describe('Follow', function () {

  var tmpPath = path.join(__dirname, 'tmp.log');

  beforeEach(function(done) {
    var stream = fs.createWriteStream(tmpPath, {flags: 'w'})
    log('started')
    writeRemaining(stream, 10, done);
  })

//  after(function(done) {
//    fs.unlink(tmpPath, done);
//  })

  function writeRemaining(stream, count, cb){
    log('appending')
    for (var i = 0; i < count; i++){
      stream.write('Jun 16 10:20:58 server.hostname coreaudiod[121]: Enabled automatic stack shots because audio IO is inactive ' + i + ' \n', 'utf-8')
    }
    stream.once('drain',cb);
  }

  it('should read through the file when it starts', function (done) {

    var lines = 0

    ff(tmpPath, {start: 8}).on('data', function (line) {
      log('line', line)
      lines++
      if (lines === 8) {
        this.destroy();
        done();
      }
    })

  })

  it('should follow updates to the file', function (done) {

    var stream = fs.createWriteStream(tmpPath, {flags: 'a'})

    log('started')
    var lines = -1
    var totalLines = 80

    ff(tmpPath, {start: 1}).on('data', function (line) {
      log('lines++', lines++, line)
      if (lines === totalLines) {
        this.destroy();
        done()
      }
    }).once('data', function() {
        writeRemaining(stream, totalLines, function(){
          log('finished extra write')
        })
      })
  })

  it('should follow a file even if it is deleted', function(done){

    var lines = 0
    var totalLines = 25
    var deleted = false
    ff(tmpPath, {start: 5}).on('data', function (line) {
      log('lines++', lines++, line)
      if (lines >= totalLines) {
        log('all done')
        this.destroy();
        done()
      }
    })

    setInterval(function(){
      log('lines are', lines)
      if (lines === 5 && !deleted){
        deleted = true
        log('delete file')
        fs.unlink(tmpPath, function(){
          log('create file')
          var stream = fs.createWriteStream(tmpPath, {flags: 'w'})
          writeRemaining(stream, 20, function(){
            log('finished')
          })
        })
      }

    }, 10)
  })

  it.only('should follow a file even if it is emptied', function(done){

    var lines = 0
    var totalLines = 25
    var empty = false
    ff(tmpPath, {start: 5}).on('data', function (line) {
      log('lines++', lines++, line)
      if (lines >= totalLines) {
        log('all done')
        this.destroy();
        done()
      }

      if (lines === 5 && !empty){
        empty = true
        log('empty file')
        var stream = fs.createWriteStream(tmpPath, {flags: 'w'})
//        setTimeout(function() {
          writeRemaining(stream, 20, function(){
            log('finished')
          })
//        }, 10)
      }
    })

//    setInterval(function(){
//      log('lines are', lines)
//
//
//    }, 10)
  })
})