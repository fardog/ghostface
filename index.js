var fs = require('fs')
var format = require('util').format
var http = require('http')
var childProcess = require('child_process')

function onbundle(err, data) {
  if(err) {
    return exit(err)
  }

  var html = format(fs.readFileSync('./page.html').toString(), data)

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
      , ['./it.phantom.js', address.port, address.address ]
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

function exit(err) {
  process.stderr.write(err.trace)
  process.exit(1)
}
