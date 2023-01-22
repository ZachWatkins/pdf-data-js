const { platform } = require('os')
const { exec } = require('child_process')

const WINDOWS_PLATFORM = 'win32'
const MAC_PLATFORM = 'darwin'
const osPlatform = platform()

let command
if (osPlatform === WINDOWS_PLATFORM) {
  command = 'start'
} else if (osPlatform === MAC_PLATFORM) {
  command = 'open'
} else {
  command = 'google-chrome --no-sandbox'
}

function open(url) {
  if (!url) return new Error('URL not provided.')
  let opencmd = `${command} ${url}`
  console.log(`executing command: ${opencmd}`)

  exec(opencmd)
}

module.exports = open
