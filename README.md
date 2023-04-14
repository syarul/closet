# closet-type

[![npm package](https://img.shields.io/badge/npm-0.0.2-blue.svg)](https://www.npmjs.com/package/closet-type)
[![Build status](https://ci.appveyor.com/api/projects/status/weij73ekw2rak2j0/branch/main?svg=true)](https://ci.appveyor.com/project/syarul/closet/branch/main)
[![Coverage Status](https://coveralls.io/repos/github/syarul/closet/badge.svg?branch=main)](https://coveralls.io/github/syarul/closet?branch=main)

A compilation types checking in JavaScript

## Introduction

This is type checking implementation similar to `Joi` or `prop-types`. The focus of this module is to do check on `compilation` to ensure you caught errors before moving into production, once you have it ready then you can use the compiler. Some advantages are;-

- Use object to define rule/interface or simply plain string
- You can use classes or extend them and validate them
- Compile it into the clean version of codes, js to js
- Support most types defined in the lodash Lang methods as long it takes single argument

## Usage

```js
const { Closet } = require('closet-type')

const closet = new Closet()

const add = (a, b) => a + b

closet.execType(add)('number', 'number')(4, 5) // 7

closet.execType(add)('number', 'number')(4, 'foo') // error
```

To use with rule definition

```js
const closetRule = new Closet()

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

closetRule.addRules(rule)

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

closetRule.execType(fn)(data) // data
```

Check the the test for more case usage

## Compiling

To compile use the compiler executable

`npm install -g closet-type`

type `closet-compile -h`

    -h, --help             output usage information
    -V, --version          output the version number
    -f, --file <name>      file target to compile
    -o, --output <name>    file to output into

type `closet-compile -f file.closet.js -o output.js` to compile, without output parameter it will log the output to the console

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
