#!/usr/bin/env node

/**
 * Command line application to create a Zod schema from a workbook sheet.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @version 1.0.0
 * @year 2023
 */

import { schema, validate } from './index.js'

const help = `
Usage: sheet-to-zod <file> [<file[.sheet].zod.js>] [--sheet <name>] [--validate] [--verbose] [--help]

Arguments:
  <file>            Path to workbook file. Accepts "xlsx", "xls", and "csv" file types.
  <file.zod.js>     Path to output Zod schema file. Default is the workbook name with a ".zod.js" extension.

Options:
  --sheet <name>    Name of workbook sheet to extract, if applicable. Default is first sheet.
  --validate        Validate workbook data using the given Zod file.
  --verbose         Display verbose output.
  --help            Display this help message.
`

if (process.argv.length < 3 || process.argv.includes('--help')) {
  console.log(help)
} else {
  const ARGS = {
    workbook: process.argv[2],
    zodfile:
      process.argv.length > 3 && !process.argv[3].startsWith('--')
        ? process.argv[3]
        : undefined,
    sheet: process.argv.includes('--sheet')
      ? process.argv[process.argv.indexOf('--sheet') + 1]
      : undefined,
    validate: process.argv.includes('--validate'),
    verbose: process.argv.includes('--verbose'),
  }

  if (validate) {
    validate(ARGS)
  } else {
    schema(ARGS)
  }
}
