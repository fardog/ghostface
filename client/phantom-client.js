/* eslint-env browser */
/* eslint-disable no-eval */
/* global phantom, window */

// this is a phantomjs script. NOT a node script.
var webpage = require('webpage')
var system = require('system')

var page = webpage.create()
var js = system.stdin.read()

page.onConsoleMessage = onConsoleMessage
page.onCallback = onCallback
page.onError = onError

phantom.onError = onError

page.open(system.args[1], function (stat) {
  if (stat !== 'success') {
    system.stderr.write(
        'Phantom cannot open requested html file: "' + system.args[1] + '"'
    )
    phantom.exit(1)

    return
  }

  // this function executes `run` in a sandbox, we pass it the js string
  page.evaluateAsync(run, 0, js)
})

function onError (msg, trace) {
  var error = {
    message: msg,
    trace: trace
  }

  system.stderr.write(JSON.stringify(error))
  phantom.exit(1)
}

function onCallback () {
  system.stdout.write('\n')
  phantom.exit(0)
}

function onConsoleMessage (msg) {
  system.stdout.write(msg + '\n')
}

function run (c) {
  eval(c)
}
