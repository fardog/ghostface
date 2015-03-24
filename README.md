# ghostface

**This project is still in development, and is not yet published.**

Evaluate a javascript file in PhantomJS, and print the output.

Inspired by [jsdom-eval][], this module
makes it trivial to run tests in a headless browser.

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
$ browserify test.js | ghostface
```

See the TAP output printed to the console:

```
TAP version 13
# always passes
ok 1 (unnamed assert)

1..1
# tests 1
# pass  1

# ok
```

## Usage

```
$ ghostface.js --help

Usage: /home/nwittstock/Projects/ghostface/bin/ghostface.js [options] [file]

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

[jsdom-eval]: https://github.com/hayes/jsdom-eval
[tape]: https://github.com/substack/tape
[browserify]: https://github.com/substack/node-browserify
