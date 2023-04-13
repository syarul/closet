const readline = require('readline')
const fs = require('fs')

const { program } = require('commander')
program.version('0.0.1')

program
  .option('-f, --file <name>', 'file target to compile')
  .option('-o, --output <name>', 'file to output into')

program.parse(process.argv)

const { file, output } = program.opts()

const re = /\((.*?)\)/g

const remove = '// ---- remove ----'

const keyCheck = []

function ReadLine (file) {
  let lines = []
  const rd = readline.createInterface({
    input: fs.createReadStream(file),
    output: process.stdout,
    terminal: false
  })

  let inRemove = false

  return new Promise(resolve => {
    rd.on('line', function (line) {
      if (inRemove) {
        line = line + '// ---- begin remove ----'
        if (/\}\)/.test(line)) {
          inRemove = false
        }
      }
      if (line.match(re) && /execType/.test(line)) {
        const matches = line.match(re)
        if (matches.length === 3) {
          line = `${matches[0].slice(1, -1)}${matches[2]}`
        } else if (matches.length === 2) {
          line = `${matches[0].slice(1, -1)}${matches[1]}`
        } else {
          line = remove
        }
      } else if (/Closet/.test(line) || /closet/.test(line)) {
        if (/\.addRules\(\{/.test(line)) {
          inRemove = true
          line = line + '// ---- begin remove ----'
        } else {
          line = remove
        }
      } else if (/\.addRules\(/.test(line)) {
        const matches = line.match(re)
        keyCheck.push(`${matches[0].slice(1, -1)}`)
        inRemove = true
        line = line + '// ---- begin remove ----'
      }
      lines.push(line)
    })
    rd.on('close', function () {
      lines = lines.filter(f => f !== remove)
      lines = lines.filter(f => !/\/\/\s*----\s*begin\s*remove\s*----/.test(f))

      if (keyCheck.length) {
        let openingBracket = 0
        let closingBracket = 0
        keyCheck.forEach(key => {
          lines = lines.map(line => {
            if (inRemove) {
              line = line + '// ---- begin remove ----'
              if (/{/i.test(line)) {
                openingBracket++
              }
              if (/}/i.test(line)) {
                closingBracket++
              }
              if (openingBracket === closingBracket) {
                inRemove = false
              }
            }
            if (new RegExp(key).test(line)) {
              line = line + '// ---- begin remove ----'
              inRemove = true
              if (/{/i.test(line)) {
                openingBracket++
              }
              if (/}/i.test(line)) {
                closingBracket++
              }
            }
            return line
          })
          lines = lines.filter(f => !/\/\/\s*----\s*begin\s*remove\s*----/.test(f))
        })
      }
      // cleanup empty lines
      const linesRemove = []
      lines
        .map((f, i) => f.length === 0 && i)
        .filter(f => f !== false)
        .reduce((acc, curr) => {
          if (acc + 1 === curr) {
            linesRemove.push(curr)
          }
          return curr
        })
      lines = lines.filter((f, i) => !linesRemove.includes(i))
      resolve(lines.join('\n'))
    })
  })
}

if (file) {
  ReadLine(file).then(str => {
    if (output) {
      fs.writeFileSync(output, str)
    } else {
      console.log(str)
    }
  })
}
