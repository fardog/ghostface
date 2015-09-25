// from http://rosettacode.org/wiki/Fibonacci_sequence#JavaScript, under
// GNU free documentation license 1.2
/* eslint-disable no-caller */
function fib (n) {
  return (function (n, a, b) {
    return n > 0 ? arguments.callee(n - 1, b, a + b) : a
  })(n, 0, 1)
}

console.log(fib(600))
