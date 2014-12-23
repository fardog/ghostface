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

page.onError = function(msg, trace) {
  var msgStack = ['{"msg": "' + msg + '"}']

  if(trace && trace.length) {
    trace.forEach(function(t) {
      msgStack.push(JSON.stringify(t))
    })
  }

  system.stderr.write(msgStack.join('\n'))
  phantom.exit(1)
}

page.open('http://' + address + ':' + port)
