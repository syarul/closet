import { Closet } from 'closet-type'

const closet = new Closet()

console.log('foo') && closet.execType(console.log)('number')(7)

const foo = {
  bar: 1
}

const closet2 = new Closet()

closet2.addRules({
  bar: { type: 'number' }
})

closet2.execType(console.log)(foo)

const cc = new Closet()

const rule = {
  foo: { type: 'string' }
}
cc.addRules(rule)
cc.execType(console.log)({ foo: 'hello' })
