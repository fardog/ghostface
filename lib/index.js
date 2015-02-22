var path = require('path')
  , spawn = require('child_process').spawn

var phantomPath = require('phantomjs').path

var phantomscript = path.join(__dirname, '..', 'src', 'phantom-client.js')

module.exports = phantomEval

function phantomEval(options, _next) {
  var next = _next || noop
    , phantomArgs = [
          phantomscript
      ]
    , input = options.input
    , phantom

  phantom = spawn(phantomPath, phantomArgs)

  input.pipe(phantom.stdin)

  phantom.on('exit', next)
  phantom.stderr.pipe(process.stderr)
  phantom.stdout.pipe(process.stdout)
}

function noop() {
  //
}
