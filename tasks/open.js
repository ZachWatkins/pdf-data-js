#!/usr/bin/env node
/**
 * Multi-platform open file in browser.
 * @author  Zachary K. Watkins
 * @created 2023-02-06 9:42PM CST
 * @package @zachwatkins/pdf-data-js
 */
const { platform } = require('os')
const { exec } = require('child_process')
const WINDOWS_PLATFORM = 'win32'
const MAC_PLATFORM = 'darwin'
const osPlatform = platform()
const url = process.env.npm_config_url || process.env.npm_package_config_url
let command = 'google-chrome --no-sandbox'
if (osPlatform === WINDOWS_PLATFORM) {
  command = 'start'
} else if (osPlatform === MAC_PLATFORM) {
  command = 'open'
}

open(url)

function open(url) {
  if (!url) return new Error('URL not provided.')
  let opencmd = `${command} ${url}`
  console.log(`executing command: ${opencmd}`)

  exec(opencmd)
}
