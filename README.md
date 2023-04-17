# closet-type

[![NPM Version](https://img.shields.io/npm/v/closet-type.svg)](https://www.npmjs.com/package/closet-type)
[![closet-type CI](https://github.com/syarul/closet-type/actions/workflows/main-ci.yml/badge.svg)](https://github.com/syarul/closet-type/actions/workflows/main-ci.yml)
[![Coverage Status](https://coveralls.io/repos/github/syarul/closet-type/badge.svg?branch=main)](https://coveralls.io/github/syarul/closet-type?branch=main)
<!--[![Build status](https://ci.appveyor.com/api/projects/status/weij73ekw2rak2j0/branch/main?svg=true)](https://ci.appveyor.com/project/syarul/closet-type/branch/main)-->

Ensure type safety in your JavaScript code with compilation-based type checking solution.

## Introduction

This module provides an implementation of type checking similar to `Joi` or `prop-types`. Its main purpose is to check types during the compilation phase, thereby allowing you to catch errors before moving to production. Once you have prepared your code, you can use the compiler. Some of the advantages of using this module are:

- You can use objects or plain strings to define rules or interfaces
- You can use classes, or extend them and validate them
- The module compiles clean versions of your code from JS to JS
- The module supports most types defined in the Lodash Lang methods, as long as they take a single argument

## Usage

By default, performing type checking often requires hardcoding type validation, which can clutter your code with unnecessary and redundant lines.

```js
const add = (a, b) => {
  if (typeof a !== 'number' && typeof b !== 'number') { // check type
    throw new TypeError('Wrong argument types')         // check type
  }                                                     // check type
  return a + b
}

export default add
```

With `closet-type`, you can perform your checking in the wrapper itself, without having to pass it to the actual function yet.

```js
import { Closet } from 'closet-type'

const closet = new Closet()

const add = (a, b) => a + b

export default closet.execType(add)('number', 'number')
```

Experience the seamless transformation of your code after compiling with the compiler.
```js
const add = (a, b) => a + b

export default add
```

Supported types are:-
- arguments // lodash
- array // lodash
- arrayBuffer // lodash
- arrayLike // lodash
- arrayLikeObject // lodash
- boolean // lodash
- buffer // lodash
- date // lodash
- element // lodash
- empty // lodash
- error // lodash
- finite // lodash
- function // lodash
- integer // lodash
- length // lodash
- map // lodash
- NaN // lodash
- native // lodash
- nil // lodash
- null // lodash
- number // lodash
- object // lodash
- objectLike // lodash
- plainObject // lodash
- RegExp // lodash
- safeInteger // lodash
- set // lodash
- string // lodash
- symbol // lodash
- typedArray // lodash
- undefined // lodash
- weakMap // lodash
- weakSet // lodash
- promise // 

To use with rule definition

```js
import { Closet } from 'closet-type'

const rule = {
  name: { type: 'string', required: true },
  age: { type: 'number', required: true, min: 18 },
  email: { type: 'string', required: true, format: /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/ },
  address: {
    type: 'object',
    required: true,
    properties: {
      city: { type: 'string', required: true },
      state: { type: 'string', required: true },
      zip: { type: 'string', required: true, length: 5 }
    }
  }
}

const closet = new Closet()

closet.addRules(rule)

const data = {
  name: 'John',
  age: 30,
  email: 'john@example.com',
  address: {
    city: 'New York',
    state: 'NY',
    zip: '10001'
  }
}

const fn = (d) => d

closet.execType(fn)(data) // data
```

For more usage cases, check the [test](https://github.com/syarul/closet-type/tree/main/test) folder.

## Compiling

Streamline your compilation process and save time with the webpack loader [https://github.com/syarul/webpack-closet-type](https://github.com/syarul/webpack-closet-type)

`npm install webpack-closet-type`

To manually compile use the compiler executable

`npm install -g closet-type`

type `closet-compile -h`

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --file <name>      file target to compile
    -s, --string <name>    read source from string in base64
    -e, --encoding <name>  read source from string require encoding, default to utf-8
    -o, --output <name>    file to output into

You can use stdin `cat somefile.js | closet-compiler`, you can also use a base64 string input `closet-compile -s VGhpcyBpcyBhIFVURi04IHN0cmlu...`. For example type `closet-compile -f file.closet.js -o output.js` to compile, without output parameter it will log the output to stdout/console

```js
// sample.closet.js
import { Closet } from 'closet-type'

const closet = new Closet()

closet.execType(console.log)('number')(7)

const foo = {
  bar: 1
}

const closet2 = new Closet()

closet2.addRules({
  bar: { type: 'number' }
})

closet2.execType(console.log)(foo)

const cc = new Closet()

const rule = {
  foo: { type: 'string' }
}
cc.addRules(rule)
cc.execType(console.log)({ foo: 'hello' })
```

will get compiled into
```js
// sample.closet.js

console.log(7)

const foo = {
  bar: 1
}

console.log(foo)

console.log({ foo: 'hello' })
```
