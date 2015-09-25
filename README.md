# ghostface

Evaluate javascript in PhantomJS, and print the output.

[![Build Status][buildstatusimg]][buildstatus]
[![npm install][npminstallimg]][npminstall]
[![js-standard-style][jsstandardimg]][jsstandard]

Inspired by [jsdom-eval][], this module
makes it trivial to run tests in a headless browser.

## Installation

`npm install -g ghostface` will expose the `ghostface` command in your
environment.

`ghostface` does *not* include [phantomjs][] as a dependency; you should install
that however works best in your environment, and `ghostface` will find it so
long as it exists in your `$PATH`.

`ghostface` supports phantomjs versions `^1.9.0` or `^2.0.0`.

## Example

Imagine a [browserify][] project that you're testing using [tape][]:

```javascript
// file: test.js

var test = require('tape')

test('always passes', function(t) {
  t.plan(1)
  t.pass()
})
```

Run it with `ghostface`:

```bash
$ browserify test.js | ghostface | tap-set-exit
```

See the output printed to the console:

```
TAP version 13
# always passes
ok 1 (unnamed assert)

1..1
# tests 1
# pass  1

# ok
```

**Note:** In the example above, we pipe output to [tap-set-exit][], which parses
TAP output and sets the correct exit codes; `ghostface` is just evaluating
javascript, it doesn't know/care what the output is, or how to set the correct
exit codes.

## Usage

```
$ ghostface --help

Usage: ghostface [options] [file]

file    Javascript file to be evaluated

Options:
  -h --html            The HTML file to be used as the page template
  -t --timeout         Milliseconds to wait for output before stopping execution. Default 1000
  -f --forever         Ignore the timeout and wait forever
  -p --phantomPath     Specify the path to the phantomjs executable
  --help               Show this message
  --version            Print version and quit
```

You can specify the JS file to be evaluated, or pipe a JS file directly into
`ghostface`. For an imaginary `file.js` in the current directory, these two
commands are equivalent:

```bash
$ ghostface file.js
$ cat file.js | ghostface
```

The JS you are evaluating will be done in a blank web page. If you want to
provide your own context, use the `--html <filename>` option to load your own
html; the JS will be evaluated after the page loads.

By default, execution is stopped if no console output is seen for over 1000ms.
You can override this timeout with `--timeout <ms>`, or choose to run forever
with `--forever`. Note you will have to send a `SIGHUP` to end execution.

## License

This project is licensed under the Apache License, Version 2.0. See
[LICENSE](./LICENSE) for the full license.

[jsdom-eval]: https://github.com/hayes/jsdom-eval
[tape]: https://github.com/substack/tape
[browserify]: https://github.com/substack/node-browserify
[tap-set-exit]: http://npm.im/tap-set-exit
[phantomjs]: http://phantomjs.org/

[buildstatus]: https://travis-ci.org/fardog/ghostface
[npminstall]: https://www.npmjs.org/package/ghostface
[jsstandard]: https://github.com/feross/standard
[buildstatusimg]: http://img.shields.io/travis/fardog/ghostface/master.svg?style=flat-square
[npminstallimg]: http://img.shields.io/npm/dm/ghostface.svg?style=flat-square
[jsstandardimg]: https://img.shields.io/badge/code%20style-standard-brightgreen.svg?style=flat-square
