function getFizzBuzz(n) {
    var response = ''

    if (n % 3 == 0) {
        response += 'fizz'
    }
    if (n % 5 == 0) {
        response += 'buzz'
    }

    return response || n
}

module.exports = getFizzBuzz
