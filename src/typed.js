const _ = require('lodash')
const ruleSet = require('./ruleSet')
const { lodashType } = require('./utils')

const typed = (types) => {
  let ind = 0
  let typed = ''
  return _.curry(function () {
    const areArgsValid = types.every((type, index) => {
      if (typeof type === 'string') {
        ind = index
        typed = type
        return _[lodashType(type)](arguments[index], type)
      } else if (typeof type === 'object') {
        return ruleSet(type)(arguments[index])
      }
      throw new TypeError(`type method ${type} does not exist`)
    })
    if (areArgsValid) {
      // If the types match, call the original function with the arguments
      const args = arguments
      return _.curry(function (fn) {
        return fn.apply(this, args)
      })
    } else {
      // If the types do not match, throw an error
      throw new TypeError(`Invalid argument [${ind}] type ${typed}`)
    }
  })
}

module.exports = typed
