var fs = require('fs')
  , path = require('path')

var chalk = require('chalk')
  , parseArgs = require('minimist')
  , concat = require('concat-stream')

var pkg = require('../package.json')

var info = chalk.blue.bold

module.exports = cli

function cli(argv, _next) {
  var options = {
          alias: {
              html: 'h'
          }
        , 'string': ['html']
        , 'boolean': ['help', 'version']
      }
    , errors = []
    , message = null
    , next = _next || noop
    , parsed

  var helpMessage = [
      info('Usage: ' + process.argv[1] + ' [options] [file]')
    , ''
    , 'file    Javascript file to be injected into the page'
    , ''
    , 'Options:'
    , '  -h --html            The HTML file to be used as the page template'
    , '  --help               Show this message'
    , '  --version            Print version and quit'
  ]

  parsed = parseArgs(argv, options)

  if (parsed.version) {
    message = '' + pkg.version

    next(null, message)

    return
  } else if (parsed.help) {
    message = helpMessage.join('\n')

    next(null, message)

    return
  }

  // ensure that parameter-expecting options have parameters
  options.string.forEach(function(i) {
    if(typeof parsed[i] !== 'undefined') {
      if (typeof parsed[i] !== 'string' || parsed[i].length < 1) {
        errors.push(new Error(i + ' expects a value.'))
      }
    }
  })

  if(!process.stdin.isTTY) {
    process.stdin.pipe(concat(onData))
  } else if (parsed._.length) {
    fs.createReadStream(path.resolve(process.cwd(), parsed._[0]))
      .pipe(concat(onData))
  } else {
    errors.push(new Error('You must specify a source file, or pipe'))

    next(errors)

    return
  }

  function onData(data) {
    parsed.file = data

    next(null, message, parsed)
  }
}

function noop() {
  //
}
