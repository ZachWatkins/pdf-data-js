# Workbook Extract CLI Application

This command line application makes it easier to validate and extract workbook data to multiple data types.

It uses the following packages:

1. [XLSX](https://www.npmjs.com/package/xlsx) for reading and writing Excel files.
2. [Zod](https://www.npmjs.com/package/zod) for validating workbook data.
3. [JSON-to-Zod](https://www.npmjs.com/package/json-to-zod) for converting JSON data to Zod schema files.

I considered using [AJV](https://www.npmjs.com/package/ajv) for validating workbook data using the JSON Schema specification, but chose Zod because it has a CLI application for converting JSON data to Zod schema files. The ease of automatically creating schema from a data set is crucial.

## Command Line Interface

The command line interface is available as `workbook-extract` and supports the following options:

```
Usage: workbook-extract [command] [--workbook <file>] [--config <file>] [--verbose] [--help]

Commands:
  run        Validate and extract data from the target workbook.
  schema     Extract schema from the target workbook.
  validate   Validate workbook file using JSON schema.
  help, h    Display this help message.

Options:
  --workbook <file>   Workbook file path.
  --config <file>     Configuration file path.
  --verbose           Display verbose output.
  --help              Display this help message.
```
