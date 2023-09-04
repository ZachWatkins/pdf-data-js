/**
 * Command line application to extract workbook data to predefined JSON files.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import Args from './src/args.js'
import XLSX from 'xlsx'
import Schema from './src/sql-create-table.js'
import run from './src/run.js'

const help = `
Usage: workbook-extract [command] [--config <file>] [--verbose] [--help]

Commands:
  build     Build workbook files from configuration.
  help, h   Display this help message.

Options:
  --config <file>   Configuration file path.
  --verbose         Display verbose output.
  --help            Display this help message.
`

const ARGS = new Args({
  workbook: '../../data/nationaldatabaseofchildcareprices.xlsx',
  config: 'workbook-extract.config.json',
})

if (ARGS.help) {
  console.log(help)
  process.exit(0)
}

if ('run' === ARGS.command) {
  if (ARGS.verbose) {
    console.log('Running workbook-extract.')
  }
  run(ARGS)
}
