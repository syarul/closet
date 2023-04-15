const Closet = require('../src/closet')

const closet = new Closet()

const run = (num) => {
  return num
}

module.exports = closet.execType(run)('number')
