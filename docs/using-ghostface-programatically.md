# Using `ghostface` Programatically

Although the API isn't stable yet, `ghostface` can be used programatically as a
require-able module. Do:

```bash
npm install --save ghostface
```

Then, use it in your project:

```javascript
var fs = require('fs')
var path = require('path')
var ghostface = require('ghostface')

var options = {
  html: path.join(__dirname, 'file.html'),
  timeout: 1000,
  input: fs.createReadStream(path.join(__dirname, 'file.js')),
  phantomPath: '/usr/sbin/phantomjs'
}

ghostface(options, process, function(code, signal) {
  if(code > 0) {
    console.error(sprintf('\nphantomjs exited abnormally: %d'), code)
  }

  process.exit(code || signal === 'SIGTERM' ? 0 : 1)
})
```

For a complete list of available options, see the command-line argument parser
at [`cli.js`](../lib/cli.js).

Again, note that this API is not stable, and for all purposes should be
considered undocumented; once it is properly defined, the
[`README`](../README.md) will be updated accordingly.
