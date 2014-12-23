# Ghostface

Like [jsdom-eval](https://github.com/hayes/jsdom-eval) but for phantomjs.

## Usage:

```bash
ghostface --html ./optional.html ./my.js
```

or

```bash
cat ./my.js | ghostface --html ./optional.html
```

The specified js gets inserted into an html file which is delivered to phantom
when it opens a page. It gets inserted at the bottom of the body, no matter
what else is in the file. This allows you include other scripts if you need to.
