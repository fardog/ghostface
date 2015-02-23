/* eslint-env browser */
/* eslint-disable no-underscore-dangle */
/* global phantom, window */

// this is a phantomjs script. NOT a node script.
var webpage = require('webpage')
  , system = require('system')
  , fs = require('fs')

var page = webpage.create()
  , js = system.stdin.read()

page.onConsoleMessage = onConsoleMessage
page.onCallback = onCallback
phantom.onError = onError

page.content = fs.read(phantom.args[0])

// this function executes `run` in a sandbox, we pass it the js string
page.evaluateAsync(run, 0, js)

function onError(msg, trace) {
  var msgStack = ['PHANTOM ERROR: ' + msg]
  if (trace && trace.length) {
    msgStack.push('TRACE:')
    trace.forEach(function(t) {
      msgStack.push(
          ' -> '
        + (t.file || t.sourceURL)
        + ': '
        + t.line
        + (t.function ? ' (in function ' + t.function +')' : '')
      )
    })
  }
  system.stderr.write(msgStack.join('\n'))
  phantom.exit(1)
}

function onCallback() {
  system.stdout.write('\n')
  phantom.exit(0)
}

function onConsoleMessage(msg) {
  system.stdout.write(msg + '\n')
}

function run(js) {
  var _timeout = window.setTimeout
    , _interval = window.setInterval
    , _immediate = window.setImmediate
    , _ctimeout = window.clearTimeout
    , _cinterval = window.clearInterval

  var _timeouts = []
    , _intervals = []
    , _immediates = []

  window.setTimeout = function(cb, ms) {
    var id = _timeout(timeout, ms)

    _timeouts.push(id)

    return id

    function timeout() {
      var index = _timeouts.indexOf(id)

      if(index > -1) {
        _timeouts.splice(index, 1)
      }
      cb()
    }
  }

  window.clearTimeout = function(id) {
    var index = _timeouts.indexOf(id)
    if(index > -1) {
      _timeouts.splice(index, 1)
    }

    return _ctimeout(id)
  }

  window.setInterval = function(cb, ms) {
    var id = _interval(cb, ms)

    _intervals.push(id)

    return id
  }

  window.clearInterval = function(id) {
    var index = _intervals.indexOf(id)
    if(index) {
      _intervals.splice(index, 1)
    }

    return _cinterval(id)
  }

  eval(js)

  setTimeout(checkRunning, 100)

  function checkRunning() {
    var running = _intervals.length + _timeouts.length

    if(!running) {
      window.callPhantom()

      return
    }

    setTimeout(checkRunning, 100)
  }
}
