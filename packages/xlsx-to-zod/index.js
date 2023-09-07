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
Usage: xlsx-to-zod [--config <file>] [--verbose] [--help]

Options:
  --config <file>   Configuration file path.
  --no-override     Do not override existing target files. Default is true.
  --verbose         Display verbose output.
  --help            Display this help message.
`

const ARGS = new Args({
  config: 'workbook-extract.config.json',
})

if (ARGS.help) {
  console.log(help)
  process.exit(0)
}

schema(ARGS)
