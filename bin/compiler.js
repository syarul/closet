const readline = require('readline')
const { Readable } = require('stream')
const fs = require('fs')

const { program } = require('commander')
program.version('0.0.1')

program
  .option('-f, --file <name>', 'file target to compile')
  .option('-s, --string <name>', 'read source from string in base64')
  .option('-e, --encoding <name>', 'read source from string require encoding, default to utf-8', 'utf-8')
  .option('-o, --output <name>', 'file to output into')

program.parse(process.argv)

const { file, string, encoding, output } = program.opts()

const re = /\((.*?)\)/g

const remove = '// ---- remove ----'

const keyCheck = []

function ReadLine (file) {
  let input
  if (file) {
    input = fs.createReadStream(file)
  } else if (string) {
    const str = Buffer.from(string, 'base64').toString(encoding)
    input = Readable.from(str, { encoding })
  } else {
    input = process.stdin
  }

  let lines = []
  const rd = readline.createInterface({
    input,
    output: process.stdout,
    terminal: false
  })

  let inRemove = false

  let inExport = false

  return new Promise(resolve => {
    let exportOpeningBracket = 0
    let exportClosingBracket = 0
    rd.on('line', function (line) {
      if (inRemove) {
        line = line + '// ---- begin remove ----'
        if (/\}\)/.test(line)) {
          inRemove = false
        }
      }
      if (/export/.test(line)) {
        inExport = true
        if (/{/i.test(line)) {
          exportOpeningBracket++
        }
        if (/}/i.test(line)) {
          exportClosingBracket++
        }
      }
      if (!/export/.test(line) && inExport) {
        if (/{/i.test(line)) {
          exportOpeningBracket++
        }
        if (/}/i.test(line)) {
          exportClosingBracket++
        }
      }
      if (exportOpeningBracket === exportClosingBracket) {
        inExport = false
      }
      if (line.match(re) && /execType/.test(line)) {
        // first split the lines base one spacing
        const lineSplit = line.split(/\s/)
        line = lineSplit.map(split => {
          // only check split that has execType
          if (/execType/.test(split)) {
            const matches = split.match(re)
            let closetKey = line.match(/(?<=\s)(\S+)(?=\.execType)/)
            // try to look for key on starting split
            if (!closetKey) {
              closetKey = line.match(/^(\S+)(?=\.execType)/)
            }
            // remove closet method
            split = split.replace(`${closetKey[0]}.execType`, '')
            // remove the bracket on the first matches
            split = split.replace(matches[0], matches[0].slice(1, -1))
            // remove type matches
            if (matches.length === 3) {
              split = split.replace(matches[1], '')
            }
            // only remove when it was export line
            if (matches.length === 2 && ((/export/.test(line)) || inExport)) {
              split = split.replace(matches[1], '')
            }
          }
          return split
        }).reduce((acc, curr, i) => `${acc}${i === 0 ? '' : ' '}${curr}`, '') // rejoin the string
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
        // inRemove = true
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
        }, 0)
      lines = lines.filter((f, i) => !linesRemove.includes(i))
      // trim files line top/bottom
      const trims = []
      for (let i = 0; i < lines.length - 1; i++) {
        if (!lines[i].length) {
          trims.push(i)
        } else {
          break
        }
      }
      for (let i = lines.length - 1; i > -1; i--) {
        if (!lines[i].length) {
          trims.push(i)
        } else {
          break
        }
      }
      lines = lines.filter((f, i) => !trims.includes(i))
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
} else {
  ReadLine().then(str => {
    if (output) {
      fs.writeFileSync(output, str)
    } else {
      console.log(str)
    }
  })
}
