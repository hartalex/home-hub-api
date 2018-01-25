var simple = require('simple-mock')

module.exports = {
  init: function () {
    var mockdb = {}
    simple.mock(mockdb, 'close')
    simple.mock(this, 'connect').returnWith(new Promise(function (resolve, reject) {
      resolve({ close: function () {} })
    }))
    simple.mock(this, 'queryLastData').callbackWith({tempInFarenheit: 0})
    simple.mock(this, 'queryOneData').callbackWith({})
    return this
  }
}.init()
