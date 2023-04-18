const { _, lodashType } = require('./utils')

const ruleSet = (rules) => {
  const errors = {}
  function validator (rule, key) {
    let isType
    const [mKey, data] = this
    const cKey = mKey.length ? `${mKey}.${key}` : key
    if (key === 'oneOf' && rule.length) {
      const truth = rule.some(r => _()[lodashType(r)](data, r))
      if (!truth) {
        errors[cKey] = `must be one of ${rule.join(', ')}`
      }
    } else if (rule.oneOf && rule.oneOf.length) {
      const truth = rule.oneOf.some(r => _()[lodashType(r)](data[key], r))
      if (!truth) {
        errors[cKey] = `${cKey} must be one of ${rule.join(', ')}`
      }
    } else if (key === 'instanceOf' && data.constructor !== rule) {
      errors[cKey] = `must be instance of ${rule}`
    } else if (key !== 'instanceOf') {
      isType = lodashType(rule.type)
    }
    if (rule.required && data[key] === undefined) {
      errors[cKey] = `${cKey} is required`
    } else if (!rule.oneOf && data[key] !== undefined && !_()[isType](data[key], rule.type)) {
      errors[cKey] = `${cKey} must be a ${rule.type}`
    } else if (rule.min !== undefined && data[key] < rule.min) {
      errors[cKey] = `${cKey} must be at least ${rule.min}`
    } else if (
      rule.format !== undefined &&
      rule.format instanceof RegExp &&
      !rule.format.test(data[key])
    ) {
      errors[cKey] = `${cKey} must match the format ${rule.format}`
    } else if (
      rule.format !== undefined &&
      typeof rule.format === 'function' &&
      !rule.format(data[key])
    ) {
      errors[cKey] = `${cKey} must match the format ${rule.format}`
    } else if (key !== 'instanceOf' && rule.length !== undefined && typeof data === 'object' && data[key].length !== rule.length) {
      errors[cKey] = `${cKey} must be ${rule.length} characters long`
    } else if (rule.properties !== undefined) {
      const properties = rule.properties
      for (const propKey in properties) {
        validator.call([key, data[key]], properties[propKey], propKey)
      }
    }
  }
  return function (data) {
    for (const key in rules) {
      validator.bind(['', data])(rules[key], key)
    }
    const errorKeys = Object.keys(errors)
    if (errorKeys.length > 0) {
      errorKeys.forEach(e => { throw new TypeError(errors[e]) })
    }
    return data
  }
}

module.exports = ruleSet
