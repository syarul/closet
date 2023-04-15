const { Closet } = require('closet-type')

const closet = new Closet()

const run = (num) => {
  return num
}

module.exports = {
  run: closet.execType(run)('number')
}
