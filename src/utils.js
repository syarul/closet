// only import needed lodash Lang
const isArguments = require('lodash').isArguments
const isArray = require('lodash').isArray
const isArrayBuffer = require('lodash').isArrayBuffer
const isArrayLike = require('lodash').isArrayLike
const isArrayLikeObject = require('lodash').isArrayLikeObject
const isBoolean = require('lodash').isBoolean
const isBuffer = require('lodash').isBuffer
const isDate = require('lodash').isDate
const isElement = require('lodash').isElement
const isEmpty = require('lodash').isEmpty
const isError = require('lodash').isError
const isFinite = require('lodash').isFinite
const isFunction = require('lodash').isFunction
const isInteger = require('lodash').isInteger
const isLength = require('lodash').isLength
const isMap = require('lodash').isMap
const isNaN = require('lodash').isNaN
const isNative = require('lodash').isNative
const isNil = require('lodash').isNil
const isNull = require('lodash').isNull
const isNumber = require('lodash').isNumber
const isObject = require('lodash').isObject
const isObjectLike = require('lodash').isObjectLike
const isPlainObject = require('lodash').isPlainObject
const isRegExp = require('lodash').isRegExp
const isSafeInteger = require('lodash').isSafeInteger
const isSet = require('lodash').isSet
const isString = require('lodash').isString
const isSymbol = require('lodash').isSymbol
const isTypedArray = require('lodash').isTypedArray
const isUndefined = require('lodash').isUndefined
const isWeakMap = require('lodash').isWeakMap
const isWeakSet = require('lodash').isWeakSet

const _ = {
  isArguments,
  isArray,
  isArrayBuffer,
  isArrayLike,
  isArrayLikeObject,
  isBoolean,
  isBuffer,
  isDate,
  isElement,
  isEmpty,
  isError,
  isFinite,
  isFunction,
  isInteger,
  isLength,
  isMap,
  isNaN,
  isNative,
  isNil,
  isNull,
  isNumber,
  isObject,
  isObjectLike,
  isPlainObject,
  isRegExp,
  isSafeInteger,
  isSet,
  isString,
  isSymbol,
  isTypedArray,
  isUndefined,
  isWeakMap,
  isWeakSet,
  isPromise: function (value) { // added Promise checker
    return value instanceof Promise
  }
}

const lodashType = (type) => {
  const vType = `is${type.charAt(0).toUpperCase()}${type.slice(1)}`
  if (_[vType] === undefined) {
    throw new TypeError(`Lodash method ${vType} does not exist`)
  }
  return `is${type.charAt(0).toUpperCase()}${type.slice(1)}`
}

module.exports = {
  lodashType,
  _
}
