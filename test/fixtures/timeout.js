function doTimeout(n) {
  setTimeout(function() {
    console.log(n)
    doTimeout(n * 1.1)
  }, n)
}

doTimeout(5)
