# ghostface Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

## HEAD
- Updates to [standard](http://standardjs.com) style
- Adds doc on using ghostface programatically
- Miscellaneous README improvements

## [1.5.0] - 2015-08-31
- Allows version 2.0.1-development to be used

## [1.4.0] - 2015-08-23
- Fixes an issue with phantomjs exit codes being ignored, and the exit code of
  ghostface being set incorrectly. Thanks to [arjunmehta][] for reporting this
  issue, and identifying the correct fix.

[arjunmehta]: https://github.com/arjunmehta

## [1.3.0] - 2015-06-02
- Changes the way timeouts are handled; fixes issues where stream buffering
  would cause incorrect timeouts to occur.

## [1.2.1] - 2015-06-01
- If phantom exits or crashes for any reason other than a timeout, report a
  message to stderr.
- Fixes a bad publish of 1.2.0

## ~~[1.2.0] - 2015-06-01~~
- REDACTED this was the result of a bad publish

## [1.1.3] - 2015-05-05
- Adds `phantomjs` keyword to match the [phantomjs][] package.

[phantomjs]: http://npm.im/phantomjs

## [1.1.2] - 2015-04-26
- Documentation updates
- Adds [changelog](./CHANGELOG.md)

## [1.1.1] - 2015-04-24
- Exports the correct file: Although `ghostface` wasn't necessarily meant to be
  used programmatically, you absolutely *could* use it as such. This corrects
  the package.json to export the correct file.
- Updates the license to the OSI standard license name.

## [1.1.0] - 2015-04-24
- Turns out we weren't actually loading the html we thought we were;
  that's corrected and a test is added for it.
- Opens the page rather than just replacing the content on
  'about:blank', avoiding SECURITY_ERR issues
- Fixes a prone-to-failure timing test

## [1.0.2] - 2015-04-23
- Documentation updates

## [1.0.1] - 2015-04-20
- Supports phantomjs 2.0.0 correctly; we were using a deprecated method of
  accessing phatom's argv, which caused a failure.

## [1.0.0] - 2014-04-20
- Adds support for source maps
- Better stack traces

## 0.2.0 - 2014-04-20
- Adds tests
- Massive numbers of fixes caught in testing

## 0.1.0 - 2014-03-24
- Initial release

[1.0.0]: https://github.com/fardog/ghostface/compare/v0.2.0...v1.0.0
[1.0.1]: https://github.com/fardog/ghostface/compare/v1.0.0...v1.0.1
[1.0.2]: https://github.com/fardog/ghostface/compare/v1.0.1...v1.0.2
[1.1.0]: https://github.com/fardog/ghostface/compare/v1.0.2...v1.1.0
[1.1.1]: https://github.com/fardog/ghostface/compare/v1.1.0...v1.1.1
[1.1.2]: https://github.com/fardog/ghostface/compare/v1.1.1...v1.1.2
[1.1.3]: https://github.com/fardog/ghostface/compare/v1.1.2...v1.1.3
[1.2.1]: https://github.com/fardog/ghostface/compare/v1.1.2...v1.2.1
[1.3.0]: https://github.com/fardog/ghostface/compare/v1.2.1...v1.3.0
[1.4.0]: https://github.com/fardog/ghostface/compare/v1.3.0...v1.4.0
[1.5.0]: https://github.com/fardog/ghostface/compare/v1.4.0...v1.5.0
