var getFizzBuzz = require('./fizzbuzz')

Array.from({ length: 100 }).forEach(function (val, index) {
    console.log( ++index + ': ' + getFizzBuzz(index) )
})
