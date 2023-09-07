/**
 * Command line application to extract workbook data to predefined JSON files.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import Args from './src/args.js'
import { schema } from './src/schema.js'
import { run } from './src/run.js'
import utils from './src/utils.js'

const help = `
Usage: workbook-extract [command] [--config <file>] [--verbose] [--help]

Commands:
  build     Build workbook files from configuration.
  help, h   Display this help message.

Options:
  --config <file>   Configuration file path.
  --override        Override existing target files. Default is false.
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
  schema(ARGS)
}
