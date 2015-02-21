// this is a phantomjs script. NOT a node script.
var webpage = require('webpage')
  , system = require('system')

var page = webpage.create()
  , js = phantom.args[0]

page.onConsoleMessage = onConsoleMessage
phantom.onError = onError

page.content = [
    '<html>'
  , '<head>'
  , '<style type="text/css">'
  , '* { margin: 0; padding: 0; }'
  , '</style>'
  , '</head>'
  , '<body>'
  , '</body>'
  , '</html>'
].join('\n')

// this function executes `run` in a sandbox, we pass it the js string
page.evaluate(run, js)

system.stdout.write('\n')

phantom.exit(0)

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

function onConsoleMessage(msg) {
  system.stdout.write(msg)
}

function run(js) {
  eval(js)
}
