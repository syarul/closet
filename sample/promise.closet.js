const Closet = require('../src/closet')

const closet = new Closet()

closet.execType(console.log)('promise')(Promise.resolve('foo'))
