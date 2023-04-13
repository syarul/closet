const typed = require('./typed')

class Closet {
  constructor () {
    this.rules = {}
    this.useRules = false
  }

  addRules (rule) {
    this.rules = rule
    this.useRules = true
  }

  execType (fn) {
    if (this.useRules) {
      return (data) => {
        return typed([this.rules])(data)(fn)
      }
    } else {
      return (...types) => {
        return (...params) => {
          return typed(types)(...params)(fn)
        }
      }
    }
  };
}

module.exports = Closet
