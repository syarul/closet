const _ = require('lodash')
const { lodashType } = require('./utils')

const ruleSet = (rules) => {
  const errors = {}
  function validator (rule, key) {
    let isType
    const [mKey, data] = this
    const cKey = mKey.length ? `${mKey}.${key}` : key
    if (key === 'oneOf' && rule.length) {
      const truth = rule.some(r => _[lodashType(r)](data, r))
      if (!truth) {
        errors[cKey] = `must be one of ${rule.join(', ')}`
      }
    } else if (rule.oneOf && rule.oneOf.length) {
      const truth = rule.oneOf.some(r => _[lodashType(r)](data[key], r))
      if (!truth) {
        errors[cKey] = `${cKey} must be one of ${rule.join(', ')}`
      }
    } else if (key === 'instanceOf' && data.constructor !== rule) {
      errors[cKey] = `must be instance of ${rule}`
    } else if (key !== 'instanceOf') {
      isType = lodashType(rule.type)
    }
    if (rule.required && !_.has(data, key)) {
      errors[cKey] = `${cKey} is required`
    } else if (!rule.oneOf && _.has(data, key) && !_[isType](data[key], rule.type)) {
      errors[cKey] = `${cKey} must be a ${rule.type}`
    } else if (_.has(rule, 'min') && data[key] < rule.min) {
      errors[cKey] = `${cKey} must be at least ${rule.min}`
    } else if (
      _.has(rule, 'format') &&
      _.isRegExp(rule.format) &&
      !rule.format.test(data[key])
    ) {
      errors[cKey] = `${cKey} must match the format ${rule.format}`
    } else if (key !== 'instanceOf' && _.has(rule, 'length') && typeof data === 'object' && data[key].length !== rule.length) {
      errors[cKey] = `${cKey} must be ${rule.length} characters long`
    } else if (_.has(rule, 'properties')) {
      _.forOwn(rule.properties, validator.bind([key, _.get(data, key)]))
    }
  }
  return _.curry(function (data) {
    _.forOwn(rules, validator.bind(['', data]))
    if (!_.isEmpty(errors)) {
      Object.keys(errors).some(e => { throw new TypeError(errors[e]) })
    }
    return data
  })
}

module.exports = ruleSet
