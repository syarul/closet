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
  arguments: isArguments,
  array: isArray,
  arrayBuffer: isArrayBuffer,
  arrayLike: isArrayLike,
  arrayLikeObject: isArrayLikeObject,
  boolean: isBoolean,
  buffer: isBuffer,
  date: isDate,
  element: isElement,
  empty: isEmpty,
  error: isError,
  finite: isFinite,
  function: isFunction,
  integer: isInteger,
  length: isLength,
  mp: isMap,
  NaN: isNaN, // preserve case sensitive
  native: isNative,
  nil: isNil,
  null: isNull,
  number: isNumber,
  object: isObject,
  objectLike: isObjectLike,
  plainObject: isPlainObject,
  RegExp: isRegExp, // preserve case sensitive
  safeInteger: isSafeInteger,
  set: isSet,
  string: isString,
  symbol: isSymbol,
  typedArray: isTypedArray,
  undefined: isUndefined,
  weakMap: isWeakMap,
  weakSet: isWeakSet,
  promise: function (value) { // added Promise checker
    return value instanceof Promise
  }
}

const lodashType = (type) => {
  if (_[type] === undefined) {
    throw new TypeError(`Method ${type} does not exist`)
  }
  return type
}

module.exports = {
  lodashType,
  _
}
