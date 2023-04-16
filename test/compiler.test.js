const exec = require('child_process').exec
const fs = require('fs')

test('compile:sample.closet.js', async function () {
  const script = exec('node ./bin/compiler.js -f sample/sample.closet.js')

  const scriptStd = new Promise((resolve, reject) => {
    script.stdout.on('data', function (data) {
      resolve(data.toString())
    })

    script.stderr.on('data', function (data) {
      reject(data.toString())
    })
  })

  const result = await scriptStd

  expect(result).toBe(
`console.log('foo') && console.log(7)

const foo = {
  bar: 1
}

console.log(foo)

console.log({ foo: 'hello' })
`)
})

test('compile:sampleRequire.closet.js', async function () {
  const script = exec('node ./bin/compiler.js -f sample/sampleRequire.closet.js')

  const scriptStd = new Promise((resolve, reject) => {
    script.stdout.on('data', function (data) {
      resolve(data.toString())
    })

    script.stderr.on('data', function (data) {
      reject(data.toString())
    })
  })

  const result = await scriptStd

  expect(result).toBe(
`const run = (num) => {
  return num
}

module.exports = run
`)
})

test('compile:export.closet.js', async function () {
  const script = exec('node ./bin/compiler.js -f sample/export.closet.js')

  const scriptStd = new Promise((resolve, reject) => {
    script.stdout.on('data', function (data) {
      resolve(data.toString())
    })

    script.stderr.on('data', function (data) {
      reject(data.toString())
    })
  })

  const result = await scriptStd

  expect(result).toBe(
`const run = (num) => {
  return num
}

export default run
`)
})

test('compile:exportObject.closet.js', async function () {
  const script = exec('node ./bin/compiler.js -f sample/exportObject.closet.js')

  const scriptStd = new Promise((resolve, reject) => {
    script.stdout.on('data', function (data) {
      resolve(data.toString())
    })

    script.stderr.on('data', function (data) {
      reject(data.toString())
    })
  })

  const result = await scriptStd

  expect(result).toBe(
`const run = (num) => {
  return num
}

module.exports = {
  run: run
}
`)
})

test('compile:stdin', async function () {
  const script = exec('cat sample/exportObject.closet.js | node ./bin/compiler.js')

  const scriptStd = new Promise((resolve, reject) => {
    script.stdout.on('data', function (data) {
      resolve(data.toString())
    })

    script.stderr.on('data', function (data) {
      reject(data.toString())
    })
  })

  const result = await scriptStd

  expect(result).toBe(
`const run = (num) => {
  return num
}

module.exports = {
  run: run
}
`)
})

test('compile:string_base64', async function () {
  const fileString = fs.readFileSync('sample/exportObject.closet.js', 'utf8')

  const base64String = Buffer.from(fileString, 'utf8').toString('base64')

  const script = exec(`node ./bin/compiler.js -s ${base64String}`)

  const scriptStd = new Promise((resolve, reject) => {
    script.stdout.on('data', function (data) {
      resolve(data.toString())
    })

    script.stderr.on('data', function (data) {
      reject(data.toString())
    })
  })

  const result = await scriptStd

  expect(result).toBe(
`const run = (num) => {
  return num
}

module.exports = {
  run: run
}
`)
})
