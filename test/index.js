var fs = require('fs')

var test = require('tape')
var through = require('through')
var phantom = require('phantomjs')
var concat = require('concat-stream')

var lib = require('../lib')

test('executes simple js', function (t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/simple.js')
  var p = makeProcessObject()

  var options = {
    input: js,
    html: './test/fixtures/test.html',
    phantomPath: phantom.path,
    timeout: 10
  }

  p.stdout.pipe(concat(function (data) {
    t.equal(data.toString(), 'simple test\n', 'output should match')
  }))

  lib(options, p, done)

  function done (code, signal) {
    t.equal(signal, 'SIGTERM', 'should have been terminated')
  }
})

test('loads the requested html file', function (t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/get-title.js')
  var p = makeProcessObject()

  var options = {
    input: js,
    html: './test/fixtures/test.html',
    phantomPath: phantom.path,
    timeout: 10
  }

  p.stdout.pipe(concat(function (data) {
    t.equal(data.toString(), 'test html\n', 'should get page title')
  }))

  lib(options, p, done)

  function done (code, signal) {
    t.equal(signal, 'SIGTERM', 'should have been terminated')
  }
})

test('executes fibonacci for some reason', function (t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/fibonacci.js')
  var p = makeProcessObject()

  var options = {
    input: js,
    html: './test/fixtures/test.html',
    phantomPath: phantom.path,
    timeout: 10
  }

  p.stdout.pipe(concat(function (data) {
    t.equal(data.toString(), '1.1043307057295211e+125\n', 'output should match')
  }))

  lib(options, p, done)

  function done (code, signal) {
    t.equal(signal, 'SIGTERM', 'should have been terminated')
  }
})

test('fails and sets correct exit code', function (t) {
  t.plan(3)

  var js = fs.createReadStream('./test/fixtures/fail.js')
  var p = makeProcessObject()

  var options = {
    input: js,
    html: './test/fixtures/test.html',
    phantomPath: phantom.path,
    timeout: 100
  }

  p.stdout.pipe(concat(function (data) {
    t.equal(data.length, 0)
  }))

  p.stderr.pipe(concat(function (data) {
    t.equal(
        data.toString()
      , '\n\nTypeError: \'undefined\' is not a function (evaluating ' +
          '\'console.derp(\'whoops\')\')\n    at :1\n'
      , 'output should match'
    )
  }))

  lib(options, p, done)

  function done (code, signal) {
    p.stderr.write(null)
    t.equal(code, 1, 'exit code should not be clean')
  }
})

test('handles timeouts when set', function (t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/timeout.js')
  var p = makeProcessObject()

  var options = {
    input: js,
    html: './test/fixtures/test.html',
    phantomPath: phantom.path,
    timeout: 50
  }

  var now = Date.now()

  p.stdout.pipe(concat(function () {
    t.ok(approx(600, Date.now() - now, 150), 'should take approximately 600ms')
  }))

  lib(options, p, done)

  function done (code, signal) {
    t.equal(signal, 'SIGTERM', 'should have been terminated')
  }
})

test('handles source maps when available', function (t) {
  t.plan(2)

  var js = fs.createReadStream('./test/fixtures/browserify.js')
  var p = makeProcessObject()

  var options = {
    input: js,
    html: './test/fixtures/test.html',
    phantomPath: phantom.path,
    timeout: 50
  }

  var expected = '\n\nTypeError: \'undefined\' is not a function ' +
    '(evaluating \'console.whoops(\'i am terrible\')\')\n' +
    '    at lib/something.js:2\n' +
    '    at index.js:4\n' +
    '    at ../../../../../../.nvm/v0.10.37/lib/node_modules/browserify/node_modules/browser-pack/_prelude.js:1\n' +
    '    at ../../../../../../.nvm/v0.10.37/lib/node_modules/browserify/node_modules/browser-pack/_prelude.js:1\n' +
    '    at null:0\n'

  p.stderr.pipe(concat(function (data) {
    t.equal(data.toString(), expected)
  }))

  lib(options, p, done)

  function done (code) {
    p.stderr.write(null)
    t.equal(code, 1, 'exit code should not be clean')
  }
})

function makeProcessObject () {
  var p = {
    stdin: through(),
    stdout: through(),
    stderr: through()
  }

  return p
}

function approx (number, compare, skew) {
  var lower = compare - skew
  var upper = compare + skew

  return lower < number && number < upper
}
