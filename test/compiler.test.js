const exec = require('child_process').exec

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
