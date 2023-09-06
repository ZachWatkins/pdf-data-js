/**
 * Command line application to extract workbook data to predefined JSON files.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import Args from './src/args.js'
import XLSX from 'xlsx'
// import Schema from './src/sql-create-table.js'
import { run } from './src/run.js'
import { ToSchemaFile } from './src/schema.js'
import utils from './src/utils.js'
import fs from 'fs'

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
  run(ARGS)
}

if ('schema' === ARGS.command) {
  utils.log(ARGS.verbose, 'Creating schema file.')

  const workbook = XLSX.readFile(ARGS.workbook)
  const sheet = workbook.Sheets[ARGS.sheet]
  const data = XLSX.utils
    .sheet_to_json(sheet)
    .filter((row) => row.County_Name === 'Brazos County')
  const schema = ToSchemaFile(data)
  fs.writeFileSync('schema.js', schema)
}
