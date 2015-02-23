var path = require('path')
  , spawn = require('child_process').spawn
  , sprintf = require('util').format

var phantomscript = path.join(__dirname, '..', 'client', 'phantom-client.js')

module.exports = phantomEval

function phantomEval(options, _next) {
  var next = _next || noop
    , phantomArgs = [
          phantomscript
        , options.html
      ]
    , input = options.input
    , phantom

  phantom = spawn(options.phantomPath, phantomArgs)

  input.pipe(phantom.stdin)

  phantom.on('exit', onExit)
  phantom.stderr.pipe(process.stderr)
  phantom.stdout.pipe(process.stdout)

  function onExit(code) {
    if(code) {
      console.error(sprintf('Phantom exited abnormally: %d', code))
    }

    next(code)
  }
}

function noop() {
  //
}
