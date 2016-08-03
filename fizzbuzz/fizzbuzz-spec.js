var getFizzBuzz = require('./fizzbuzz')

describe('FizzBuzz', function() {

    it('1 deve retornar 1', function() {
        expect( getFizzBuzz(1) ).toBe(1)
    })

    it('2 deve retornar 2', function() {
        expect( getFizzBuzz(2) ).toBe(2)
    })

    it('3 deve retornar fizz', function() {
        expect( getFizzBuzz(3) ).toBe('fizz')
    })

    it('5 deve retornar buzz', function() {
        expect( getFizzBuzz(5) ).toBe('buzz')
    })

    it('6 deve retornar fizz', function() {
        expect( getFizzBuzz(6) ).toBe('fizz')
    })

    it('10 deve retornar buzz', function() {
        expect( getFizzBuzz(10) ).toBe('buzz')
    })

    it('15 deve retornar fizzbuzz', function() {
        expect( getFizzBuzz(15) ).toBe('fizzbuzz')
    })

    it('30 deve retornar fizzbuzz', function() {
        expect( getFizzBuzz(30) ).toBe('fizzbuzz')
    })

    it('45 deve retornar fizzbuzz', function() {
        expect( getFizzBuzz(45) ).toBe('fizzbuzz')
    })

    it('57 deve retornar fizz', function() {
        expect( getFizzBuzz(57) ).toBe('fizz')
    })

    it('9853 deve retornar 9853', function() {
        expect( getFizzBuzz(9853) ).toBe(9853)
    })
})
