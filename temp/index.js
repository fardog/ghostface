var http = require('http')
var childProcess = require('child_process')
var SourceMapConsumer = require('source-map').SourceMapConsumer
var convert = require('convert-soruce-map')
var fs = require('fs')
var path = require('path')

module.exports = function(script, html, log) {
  var sourcemap = convert.fromSource(script)

  if(!html) {
    html = fs.readFileSync(path.join(__dirname, 'client', 'default.html'))
  }


  if(sourcemap) {
    log.debug('producing sourcemap')
    sourcemap = new SourceMapConsumer(sourcemap.toJSON())
  }

  var server = http.createServer(function(req, resp) {
    log.debug('got request')
    resp.writeHead(200, {'content-type': 'text/html'})
    resp.end(html)
  })

  server.listen(0, function(err) {
    if(err) {
      return exit(err)
    }

    var address = server.address()

    log.debug('listening at %s', JSON.stringify(address))

    var phantom = childProcess.spawn(
        'phantomjs'
      , ['./client.phantom.js', address.port, address.address ]
    )

    phantom.stdout.on('data', ondata)
    phantom.stderr.on('data', onerror)

    function ondata(data) {
      log.debug('got output')
      var d = data.toString().trim()

      if(!d) {
        return
      }

      console.log(d)
    }

    function onerror(error) {
      log.debug('heard error %s', error)
      var trace = JSON.parse(error.toString())
      console.error(trace)
    }

    phantom.on('exit', function(code) {
      server.close(function() {
        process.exit(code)
      })
    })
  })
}



function exit(log, err) {
  if(err) {
    log.error(err.trace)
  }

  process.exit(1)
}
