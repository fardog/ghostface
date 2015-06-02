#!/usr/bin/env node
var sprintf = require('util').format

var chalk = require('chalk')

var cli = require('../lib/cli')
  , lib = require('../lib')

var error = chalk.bold.red

module.exports = {
    exit: onExit
  , cli: onCli
}

cli(process.argv.slice(2), onCli)

function onCli(err, message, options) {
  if(err) {
    console.error(
        error(
            '\nYou had errors in your syntax. ' +
              'Use --help for further information.'
        )
    )
    err.forEach(function(e) {
      console.error(e.message)
    })

    return
  } else if(message) {
    console.log(message)

    return
  }

  lib(options, process, onExit)
}

function onExit(code, signal) {
  if(code > 0) {
    console.error(sprintf('\nphantomjs exited abnormally: %d'), code)
  }

  process.exit(code || signal === 'SIGTERM' ? 0 : 1)
}
