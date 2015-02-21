#!/usr/bin/env node

var chalk = require('chalk')

var cli = require('../lib/cli')

var error = chalk.bold.red

cli(process.argv.slice(2), function(err, message, options) {
  if (err) {
    console.error(
      error('\nYou had errors in your syntax. Use --help for further information.')
    )
    err.forEach(function (e) {
      console.error(e.message)
    })
    return
  }
  else if (message) {
    console.log(message)
    return
  }

  console.log(options.file)
})
