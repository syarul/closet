import { Closet } from 'closet-type'

const closet = new Closet()

const run = (num) => {
  return num
}

export default closet.execType(run)('number')
