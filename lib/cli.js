var fs = require('fs')
  , path = require('path')
  , exec = require('child_process').exec

var chalk = require('chalk')
  , parseArgs = require('minimist')
  , semver = require('semver')
  , which = require('which')

var pkg = require('../package.json')

var PHANTOM_VERSION = '^1.9.0 || ^2.0.0'
  , DEFAULT_TIMEOUT = 1000

var info = chalk.blue.bold

module.exports = cli

function cli(argv, _next) {
  var options = {
      alias: {
          html: 'h'
        , timeout: 't'
        , forever: 'f'
        , phantomPath: 'p'
      }
    , default: {
          timeout: DEFAULT_TIMEOUT
      }
    , 'string': ['html', 'phantomPath']
    , 'numeric': ['timeout']
    , 'boolean': ['forever', 'help', 'version']
  }

  var errors = []
    , message = null
    , next = _next || noop
    , parsed

  var helpMessage = [
      info('Usage: ' + process.argv[1] + ' [options] [file]')
    , ''
    , 'file    Javascript file to be evaluated'
    , ''
    , 'Options:'
    , '  -h --html            The HTML file to be used as the page template'
    , '  -t --timeout         Milliseconds to wait for output before ' +
        'stopping execution. Default ' + DEFAULT_TIMEOUT
    , '  -f --forever         Ignore the timeout and wait forever'
    , '  -p --phantomPath     Specify the path to the phantomjs executable'
    , '  --help               Show this message'
    , '  --version            Print version and quit'
  ]

  parsed = parseArgs(argv, options)

  if(parsed.version) {
    message = '' + pkg.version

    next(null, message)

    return
  } else if(parsed.help) {
    message = helpMessage.join('\n')

    next(null, message)

    return
  }

  // ensure that parameter-expecting options have parameters
  options.string.forEach(function(i) {
    if(typeof parsed[i] !== 'undefined') {
      if(typeof parsed[i] !== 'string' || parsed[i].length < 1) {
        errors.push(new Error(i + ' expects a value.'))
      }
    }
  })

  // ensure that numeric-expecting options have numbers
  options.numeric.forEach(function(i) {
    var num = Number(parsed[i])

    if(typeof parsed[i] === 'boolean' || isNaN(num) || !isFinite(num)) {
      errors.push(new Error(i + ' expects a numeric value.'))
    }
  })

  if(!process.stdin.isTTY) {
    parsed.input = process.stdin
  } else if(parsed._.length) {
    parsed.input = fs.createReadStream(
        path.resolve(process.cwd(), parsed._[0])
    )
  } else {
    errors.push(new Error('You must specify a source file, or pipe'))

    next(errors)

    return
  }

  if(!parsed.html) {
    parsed.html = path.join(__dirname, '..', 'client', 'default.html')
  }

  if(errors.length) {
    next(errors)

    return
  }

  createCheckPhantom(parsed.phantomPath)(function(err, ppath) {
    if(err) {
      errors.push(err)
      next(errors)

      return
    }

    parsed.phantomPath = ppath
    next(null, message, parsed)
  })
}

function createCheckPhantom(_phantomPath) {
  var phantomPath = _phantomPath

  return function checkPhantom(_next) {
    var next = _next || noop
      , err

    if(typeof phantomPath === 'undefined') {
      try {
        var phantom = require('phantomjs')

        phantomPath = phantom.path
      } catch(e) {
        try {
          phantomPath = which.sync('phantomjs')
        } catch(e) {
          if(!phantomPath) {
            phantomPath = null
            err = new Error(
              [
                  'Cannot find phantomjs in your PATH. If phantomjs is installed'
                , 'you may need to specify its path manually with the "-p" option.'
                , 'Run this executable with "--help" or view the README for more'
                , 'details.'
              ].join('\n')
            )

            next(err)

            return
          }
        }
      }
    }

    // If we have phantompath, see if its version satisfies our requirements
    exec(phantomPath + ' --version', function(e, stdout) {
      if(e) {
        next(new Error('Could not find phantomjs at the specified path.'))
      } else if(!semver.satisfies(stdout, PHANTOM_VERSION)) {
        next(new Error(
            'ghostface requires phantomjs ' +
              PHANTOM_VERSION +
              ' to be installed, found version ' +
              stdout
        ))
      } else {
        next(null, phantomPath)
      }
    })
  }
}

function noop() {
  // no one here but us not operations
}
