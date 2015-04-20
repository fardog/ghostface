var fs = require('fs')
  , exec = require('child_process').exec

var test = require('tape')
  , through = require('through')
  , phantom = require('phantomjs')
  , concat = require('concat-stream')

var lib = require('../lib')

test('executes simple js', function(t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/simple.js')
    , p = makeProcessObject()

  var options = {
      input: js
    , html: './test/fixtures/test.html'
    , phantomPath: phantom.path
    , timeout: 10
  }

  p.stdout.pipe(concat(function(data) {
    t.equal(data.toString(), 'simple test\n', 'output should match')
  }))

  lib(options, p, done)

  function done(code) {
    t.equal(code, 0, 'exit code should be clean')
  }
})

test('executes fibonacci for some reason', function(t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/fibonacci.js')
    , p = makeProcessObject()

  var options = {
      input: js
    , html: './test/fixtures/test.html'
    , phantomPath: phantom.path
    , timeout: 10
  }

  p.stdout.pipe(concat(function(data) {
    t.equal(data.toString(), '1.1043307057295211e+125\n', 'output should match')
  }))

  lib(options, p, done)

  function done(code) {
    t.equal(code, 0, 'exit code should be clean')
  }
})

test('fails and sets correct exit code', function(t) {
  t.plan(3)

  var js = fs.createReadStream('./test/fixtures/fail.js')
    , p = makeProcessObject()

  var options = {
      input: js
    , html: './test/fixtures/test.html'
    , phantomPath: phantom.path
    , timeout: 100
  }

  p.stdout.pipe(concat(function(data) {
    t.equal(data.length, 0)
  }))

  p.stderr.pipe(concat(function(data) {
    t.deepEqual(
        JSON.parse(data.toString())
      , {
            message: 'TypeError: \'undefined\' is not a function ' +
              '(evaluating \'console.derp(\'whoops\')\')'
          , trace: [ { file: '', function: '', line: 1 } ]
        }
      , 'output should match'
    )
  }))

  lib(options, p, done)

  function done(code) {
    t.equal(code, 1, 'exit code should not be clean')
  }
})

test('handles timeouts when set', function(t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/timeout.js')
    , p = makeProcessObject()

  var options = {
      input: js
    , html: './test/fixtures/test.html'
    , phantomPath: phantom.path
    , timeout: 50
  }

  var now = Date.now()

  p.stdout.pipe(concat(function() {
    t.ok(approx(600, Date.now() - now, 100), 'should take approximately 600ms')
  }))

  lib(options, p, done)

  function done(code) {
    t.equal(code, 0, 'exit code should be clean')
  }
})

function makeProcessObject() {
  var p = {
      stdin: through()
    , stdout: through()
    , stderr: through()
  }

  return p
}

function approx(num, equal, skew) {
  return Math.abs(num - equal) < skew
}
