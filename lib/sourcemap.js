var convert = require('convert-source-map')
var concatStream = require('concat-stream')

module.exports = getSourceMap

function getSourceMap () {
  var concat = concatStream(onDone)
  var done = false
  var map

  concat.done = isDone
  concat.map = getMap

  return concat

  function isDone () {
    return done
  }

  function getMap () {
    return map
  }

  function onDone (data) {
    var source

    if (data.length) {
      source = convert
        .fromSource(data.toString())
    }

    if (source) {
      map = source.toJSON()
    }

    concat.emit('done', map)
  }
}
