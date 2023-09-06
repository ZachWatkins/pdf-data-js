/**
 * Command line application arguments resolved from all sources.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import fs from 'fs'
import path from 'path'

/**
 * Build the command arguments from all sources.
 * @param {object} options - Options to override default behavior.
 * @param {string} options.workbook - Path to workbook file.
 * @param {boolean} options.help - Display help message.
 * @param {boolean} options.verbose - Display verbose output.
 * @param {boolean} options.override - Override existing target files.
 * @param {string} options.command - Command to execute.
 * @param {string} options.config - Path to configuration file.
 */
export default function Args({
  workbook,
  help,
  verbose,
  override,
  command,
  config,
}) {
  this.help = false
  this.verbose = false
  this.override = false
  this.command = 'run'
  this.config = ''

  // Detect arguments from the command line.
  if (process.argv.length === 2) {
    this.help = true
  } else if (process.argv.length >= 3) {
    if (
      'h' === process.argv[2] ||
      'help' === process.argv[2] ||
      'h' === command ||
      'help' === command ||
      process.argv.includes('--help')
    ) {
      this.help = true
      this.command = ''
    }
    if (process.argv[2].indexOf('--') < 0) {
      this.command = process.argv[2]
    }
    if (process.argv.includes('--verbose')) {
      this.verbose = true
    }
    if (process.argv.includes('--override')) {
      this.override = true
    }
    if (process.argv.includes('--config')) {
      this.config = process.argv[process.argv.indexOf('--config') + 1]
    }
    if (process.argv.includes('--workbook')) {
      this.workbook = process.argv[process.argv.indexOf('--workbook') + 1]
    }
  }

  // Apply arguments passed to this function which override all command line arguments.
  if (typeof help === 'boolean') {
    this.help = help
  }
  if (typeof command === 'string') {
    this.command = command
  }
  if (typeof verbose === 'boolean') {
    this.verbose = verbose
  }
  if (typeof override === 'boolean') {
    this.override = override
  }
  if (typeof config === 'string') {
    this.config = config
  }
  if (typeof workbook === 'string') {
    this.workbook = workbook
  }

  if (!this.config) {
    // See if the default config file is available.
    if (fs.existsSync(path.resolve('workbook-extract.json'))) {
      this.config = path.resolve('workbook-extract.json')
    }
  } else if (!path.isAbsolute(this.config)) {
    if (!fs.existsSync(path.resolve(this.config))) {
      throw new Error(`Configuration file not found: ${this.config}`)
    } else {
      this.config = path.resolve(this.config)
    }
  } else if (!fs.existsSync(this.config)) {
    throw new Error(`Configuration file not found: ${this.config}`)
  }
  if (this.config) {
    this.config = JSON.parse(fs.readFileSync(this.config, 'utf8'))
    if (this.config?.workbook) {
      if (!path.isAbsolute(this.config.workbook)) {
        if (!fs.existsSync(path.resolve(this.config.workbook))) {
          throw new Error(`Workbook file not found: ${this.config.workbook}`)
        } else {
          this.workbook = path.resolve(this.config.workbook)
        }
      }
    }
    if (typeof this.config.override === 'boolean') {
      this.override = this.config.override
    }
  }
}
