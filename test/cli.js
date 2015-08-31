var proxyquire = require('proxyquire')
  , test = require('tape')

var cli = proxyquire(
    '../lib/cli'
  , {
        which: {sync: whichSync}
      , phantomjs: null
    }
)

var PHANTOM_1_PATH = './test/stubs/phantom-1.9'
  , PHANTOM_2_PATH = './test/stubs/phantom-2.0'
  , PHANTOM_2_PRERELEASE = './test/stubs/phantom-2.0-dev'
  , PHANTOM_BAD_PATH = './test/stubs/phantom-bad'

test('sets sane defaults', function(t) {
  t.plan(5)

  cli(['./test/fixtures/simple.js'], done)

  function done(err, msg, options) {
    if(err) {
      t.fail(err[0].message)
      t.end()
    }

    t.false(options.forever)
    t.false(options.help)
    t.equal(options.timeout, 1000)
    t.ok(typeof options.input === 'object')
    t.equal(options.phantomPath, PHANTOM_1_PATH)
  }
})

test('allows phantom 2.0', function(t) {
  t.plan(1)

  cli(['-p', PHANTOM_2_PATH, './test/fixtures/simple.js'], done)

  function done(err, msg, options) {
    if(err) {
      t.fail(err[0].message)
      t.end()
    }

    t.equal(options.phantomPath, PHANTOM_2_PATH)
  }
})

test('allows phantom 2.0-dev', function(t) {
  t.plan(1)

  cli(['-p', PHANTOM_2_PRERELEASE, './test/fixtures/simple.js'], done)

  function done(err, msg, options) {
    if(err) {
      t.fail(err[0].message)
      t.end()
    }

    t.equal(options.phantomPath, PHANTOM_2_PRERELEASE)
  }
})


test('fails on an unknown phantom', function(t) {
  t.plan(1)

  cli(['-p', PHANTOM_BAD_PATH, './test/fixtures/simple.js'], done)

  function done(err) {
    if(err) {
      t.ok(err[0].message.match('1.8.0'))
      t.end()

      return
    }

    t.fail('should have error on old phantom')
  }
})

test('fails on no file', function(t) {
  t.plan(1)

  cli([], function(err) {
    t.equal(err[0].message, 'You must specify a source file, or pipe')
  })
})

test('string expecting parameters require strings', function(t) {
  t.plan(1)

  cli(['./test/fixtures/simple.js', '-p'], function(err) {
    t.equal(err[0].message, 'phantomPath expects a value.')
  })
})

test('number expecting parameters require numbers', function(t) {
  t.plan(1)

  cli(['./test/fixtures/simple.js', '-t'], function(err) {
    t.equal(err[0].message, 'timeout expects a numeric value.')
  })
})

function whichSync(str) {
  if(str.match('dev')) {
    return PHANTOM_2_PRERELEASE
  } else if(str.match('2')) {
    return PHANTOM_2_PATH
  } else if(str.match('bad')) {
    return PHANTOM_BAD_PATH
  }

  return PHANTOM_1_PATH
}
