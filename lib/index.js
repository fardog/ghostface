var path = require('path')
  , spawn = require('child_process').spawn
  , sprintf = require('util').format

var concat = require('concat-stream')
  , Consumer = require('source-map').SourceMapConsumer

var getSourceMap = require('./sourcemap')

var phantomscript = path.join(__dirname, '..', 'client', 'phantom-client.js')

module.exports = phantomEval

function phantomEval(options, io, _next) {
  var next = _next || noop
    , phantomArgs = [
          phantomscript
        , options.html
      ]
    , input = options.input
    , dead = false
    , sourceMap = getSourceMap()
    , killTimeout
    , phantom

  phantom = spawn(options.phantomPath, phantomArgs)

  input.pipe(phantom.stdin)
  input.pipe(sourceMap)

  phantom.on('exit', onExit)
  phantom.stdout.pipe(io.stdout)
  phantom.stderr.pipe(concat(onError))

  if(!options.forever) {
    phantom.stderr.on('data', updateTimeout)
    phantom.stdout.on('data', updateTimeout)
  }

  function updateTimeout() {
    if(killTimeout) {
      clearTimeout(killTimeout)
    }
    killTimeout = setTimeout(killPhantom, options.timeout)
  }

  function killPhantom() {
    if(!dead) {
      phantom.kill()
    }
  }

  function onExit(code, signal) {
    dead = true

    next(code, signal)
  }

  // TODO: this section requires significant cleanup
  // phantomjs has some interesting challenges, in that we can only communicate
  // sourcemaps were an after-thought, and the API needs redesign to support
  // them correctly, and be less fragile
  function onError(data) {
    var map = sourceMap.map()
      , error
      , smc

    if(!data.length) {
      return
    }

    // if what we get isn't json, it's some other undescribed phantom error;
    // just echo it.
    try {
      error = JSON.parse(data.toString())
    } catch(e) {
      io.stderr.write(sprintf('\n\n%s\n', data.toString()))

      return
    }

    // if a source map wasn't present, just output the line numbers where an
    // error occurred
    if(!map) {
      io.stderr.write(sprintf('\n\n%s\n', error.message))

      if(error.trace && error.trace.length) {
        error.trace.forEach(function(e) {
          io.stderr.write(sprintf('    at :%d', e.line))

          if(e.function) {
            io.stderr.write(sprintf(' (in function %s)', e.function))
          }

          io.stderr.write('\n')
        })
      }

      return
    }

    // else, make sense of the sourcemap and output that information
    smc = new Consumer(map)

    io.stderr.write(sprintf('\n\n%s\n', error.message))

    if(error.trace && error.trace.length) {
      error.trace.forEach(function(e) {
        if(!e.line) {
          return
        }

        // phantom doesn't provide columns in stack traces
        var err = smc.originalPositionFor(
            {line: e.line, column: e.column || 0}
        )

        io.stderr.write(sprintf('    at %s:%d\n', err.source, err.line))
      })
    }
  }
}

function noop() {
  // you open the door to find: no operations
}
