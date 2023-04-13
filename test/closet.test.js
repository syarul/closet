const Closet = require('../src/closet')

const closet = new Closet()

const add = (a, b) => a + b

test('execute:simple_args', function () {
  expect(closet.execType(add)('number', 'number')(1, 2)).toBe(3)
})

test('execute:args_failed', function () {
  expect(() => { closet.execType(add)('number', 'number')(1, 'foo') }).toThrow()
})

test('execute:failed_type_does_not_exist', function () {
  expect(() => { closet.execType(add)('number', 'foo')(1, 1) }).toThrow()
})

test('execute:s_type_is_not_string', function () {
  expect(() => { closet.execType(add)('number', 1)(1, 1) }).toThrow()
})

test('execute:array_like', function () {
  expect(closet.execType(arr => arr.reduce((a, b) => a + b, 0))('arrayLike')([1, 2, 3, 4, 5])).toBe(15)
})

test('execute:buffer', function () {
  expect(closet.execType(buff => buff.toString())('buffer')(Buffer.alloc(2))).toBe('\x00\x00')
})

const closetRule = new Closet()

const rule = {
  name: { type: 'string', required: true },
  age: { type: 'number', required: true, min: 18 },
  email: { type: 'string', required: true, format: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
  address: {
    type: 'object',
    required: true,
    properties: {
      city: { type: 'string', required: true },
      state: { type: 'string', required: true },
      zip: { type: 'string', required: true, length: 5 }
    }
  }
}

closetRule.addRules(rule)

const data = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: {
    city: 'New York',
    state: 'NY',
    zip: '10001'
  }
}

const fn = (d) => d

test('execute:rules_success', function () {
  expect(closetRule.execType(fn)(data)).toMatchObject(data)
})

test('execute:rules_failed_missing_key', function () {
  delete data.name
  expect(() => { closetRule.execType(fn)(data) }).toThrow()
})

test('execute:rules_failed_key_type', function () {
  data.name = 1
  expect(() => { closetRule.execType(fn)(data) }).toThrow()
})

test('execute:rules_failed_min', function () {
  data.name = 'John'
  data.age = 3
  expect(() => { closetRule.execType(fn)(data) }).toThrow()
})

test('execute:rules_failed_format', function () {
  data.age = 18
  data.email = 'foo'
  expect(() => { closetRule.execType(fn)(data) }).toThrow()
})

test('execute:rules_failed_length', function () {
  data.email = 'john@example.com'
  data.address.zip = '10'
  expect(() => { closetRule.execType(fn)(data) }).toThrow()
})

test('execute:test_one_of', function () {
  expect(closet.execType(e => e)({ oneOf: ['string', 'number'] })(1)).toBe(1)
})

test('execute:test_one_of_failed', function () {
  expect(() => { closet.execType(e => e)({ oneOf: ['string', 'number'] })(true) }).toThrow()
})

const rule2 = {
  description: {
    oneOf: ['string', 'boolean'],
    required: true
  }
}

test('execute:test_one_of_object', function () {
  expect(closet.execType(e => e.description)(rule2)({ description: false })).toBe(false)
})

test('execute:test_one_of_object_failed', function () {
  expect(() => { closet.execType(e => e.description)(rule2)({ description: Buffer.alloc(1) }) }).toThrow()
})

class Person {
  constructor (firstName, lastName) {
    this.firstName = firstName
    this.lastName = lastName
  }

  fullName () {
    return `${this.firstName} ${this.lastName}`
  }
}

test('execute:test_instance_of', function () {
  expect(closet.execType(e => e.fullName())({ instanceOf: Person })(new Person('a', 'b'))).toBe('a b')
})

test('execute:test_instance_of_error', function () {
  expect(() => { closet.execType(e => e.fullName())({ instanceOf: {} })(new Person('a', 'b')) }).toThrow()
})
