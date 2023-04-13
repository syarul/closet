const _ = require('lodash')

const lodashType = (type) => {
  const vType = `is${type.charAt(0).toUpperCase()}${type.slice(1)}`
  if (_[vType] === undefined) {
    throw new TypeError(`Lodash method ${vType} does not exist`)
  }
  return `is${type.charAt(0).toUpperCase()}${type.slice(1)}`
}

module.exports = {
  lodashType
}
