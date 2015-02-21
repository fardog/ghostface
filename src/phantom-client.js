// this is a phantomjs script. NOT a node script.
var webpage = require('webpage')
var system = require('system')

var args = system.args

var port = args[1]
var address = args[2]
var page = webpage.create()

page.onConsoleMessage = onConsoleMessage

function onConsoleMessage(msg) {
  console.log(msg)
}

phantom.onError = function(msg, trace) {
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

page.open('http://' + address + ':' + port)
