// only import needed lodash Lang
let _ = {
  arguments: require('lodash').isArguments,
  array: require('lodash').isArray,
  arrayBuffer: require('lodash').isArrayBuffer,
  arrayLike: require('lodash').isArrayLike,
  arrayLikeObject: require('lodash').isArrayLikeObject,
  boolean: require('lodash').isBoolean,
  buffer: require('lodash').isBuffer,
  date: require('lodash').isDate,
  element: require('lodash').isElement,
  empty: require('lodash').isEmpty,
  error: require('lodash').isError,
  finite: require('lodash').isFinite,
  function: require('lodash').isFunction,
  integer: require('lodash').isInteger,
  length: require('lodash').isLength,
  mp: require('lodash').isMap,
  NaN: require('lodash').isNaN, // preserve case sensitive
  native: require('lodash').isNative,
  nil: require('lodash').isNil,
  null: require('lodash').isNull,
  number: require('lodash').isNumber,
  object: require('lodash').isObject,
  objectLike: require('lodash').isObjectLike,
  plainObject: require('lodash').isPlainObject,
  RegExp: require('lodash').isRegExp, // preserve case sensitive
  safeInteger: require('lodash').isSafeInteger,
  set: require('lodash').isSet,
  string: require('lodash').isString,
  symbol: require('lodash').isSymbol,
  typedArray: require('lodash').isTypedArray,
  undefined: require('lodash').isUndefined,
  weakMap: require('lodash').isWeakMap,
  weakSet: require('lodash').isWeakSet,
  promise: function (value) { // added Promise checker
    return value instanceof Promise
  }
}

const addNewTypes = (newTypes) => {
  if (typeof newTypes !== 'object') {
    throw new TypeError('The added type should be an object')
  }
  Object.keys(newTypes).forEach(key => {
    if (typeof newTypes[key] !== 'function') {
      throw new TypeError('The added type property should be a function')
    }
  })
  _ = {
    ..._,
    ...newTypes
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
  addNewTypes,
  _: () => _
}
