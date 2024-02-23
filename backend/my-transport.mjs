import { createWriteStream } from 'fs'

export default (options) => {
  return createWriteStream(options.destination, { flags: 'a' }) // append to the file
}