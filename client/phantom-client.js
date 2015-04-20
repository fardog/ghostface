/* eslint-env browser */
/* eslint-disable no-eval */
/* global phantom, window */

// this is a phantomjs script. NOT a node script.
var webpage = require('webpage')
  , system = require('system')
  , fs = require('fs')

var page = webpage.create()
  , js = system.stdin.read()

page.onConsoleMessage = onConsoleMessage
page.onCallback = onCallback
page.onError = onError

phantom.onError = onError

page.content = fs.read(phantom.args[0])

// this function executes `run` in a sandbox, we pass it the js string
page.evaluateAsync(run, 0, js)

function onError(msg, trace) {
  var error = {
      message: msg
    , trace: trace
  }

  system.stderr.write(JSON.stringify(error))
  phantom.exit(1)
}

function onCallback() {
  system.stdout.write('\n')
  phantom.exit(0)
}

function onConsoleMessage(msg) {
  system.stdout.write(msg + '\n')
}

function run(c) {
  eval(c)
}
