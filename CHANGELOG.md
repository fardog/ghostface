# ghostface Change Log
All notable changes to this project will be documented in this file.
This project adheres to [Semantic Versioning](http://semver.org/).

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
