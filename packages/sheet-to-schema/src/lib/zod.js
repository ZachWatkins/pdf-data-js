import { z } from 'zod'

/**
 * Get the header text for a schema file.
 * @returns {string} Schema file header.
 */
function fileHeader() {
  return "import { z } from 'zod';\n"
}

/**
 * Get the footer text for a schema file.
 * @param {string} name - Name of the schema variable.
 * @returns {string} Schema file footer.
 */
function fileFooter(name) {
  return `export default ${name};\n`
}

/**
 * Get a string representation of what type of data is in a cell to use for defining its schema type.
 * @param {any} value - Value to evaluate.
 * @returns {string} Schema type name.
 */
function getSchemaType(value) {
  switch (typeof value) {
    case 'string':
      return 'string'
    case 'number':
      return isFloat(value) ? 'float' : 'integer'
    case 'boolean':
      return 'boolean'
    case 'undefined':
      return 'optional'
    case 'object':
      return value === null ? 'null' : 'object'
    default:
      return 'unknown'
  }
}

/**
 * Get the string representation of a schema type for use in a schema file.
 * @param {string} schemaType - Schema type name.
 * @returns {string} Schema type string.
 */
function defineForFile(schemaType) {
  switch (schemaType) {
    case 'string':
      return 'z.string()'
    case 'integer':
      return 'z.number().int()'
    case 'float':
      return 'z.number()'
    case 'boolean':
      return 'z.boolean()'
    case 'optional':
      return 'z.optional()'
    case 'null':
      return 'z.null()'
    case 'object':
      return 'z.object({})'
    default:
      return 'z.unknown()'
  }
}

/**
 * Get the schema value for a given type.
 * @param {string} schemaType - Schema type name.
 * @returns {z.ZodType<any, any>} Zod schema type.
 */
function define(schemaType) {
  switch (schemaType) {
    case 'string':
      return z.string()
    case 'integer':
      return z.number().int()
    case 'float':
      return z.number()
    case 'boolean':
      return z.boolean()
    case 'optional':
      return z.optional()
    case 'null':
      return z.null()
    case 'object':
      return z.object({})
    default:
      return z.unknown()
  }
}

/**
 * Infer the types of each property in an array of objects.
 * @param {object[]|[]} rows - Array of objects to evaluate.
 * @returns {object} Object with property names as keys and an object of types as values.
 */
function inferTypes(rows) {
  return rows.reduce((types, row) => {
    for (const prop in row) {
      if (types[prop] === undefined) {
        types[prop] = {}
      }
      let schemaType = getSchemaType(row[prop])
      if (types[prop][schemaType] === undefined) {
        types[prop][schemaType] = true
      }
    }
    return types
  }, {})
}

/**
 * Get a schema object which validates the given rows.
 * @param {object[]|[]} rows - Array of objects to evaluate.
 * @returns {z.ZodArray} Zod schema for an array of objects.
 */
function get(rows) {
  const foundTypes = inferTypes(rows)

  for (const prop in foundTypes) {
    let libTypes = Object.keys(foundTypes[prop])
    if (0 === libTypes.length) {
      schema[prop] = define('unknown')
      continue
    }
    if (1 === libTypes.length) {
      schema[prop] = define(libTypes[0])
      continue
    }
    const isOptional = libTypes.includes('optional')
    const isNullable = libTypes.includes('null')
    if (isOptional) {
      libTypes = libTypes.filter((libType) => libType !== 'optional')
    }
    if (isNullable) {
      libTypes = libTypes.filter((libType) => libType !== 'null')
    }

    schema[prop] = libTypes.reduce((acc, libType) => {
      return acc === null ? define(libType) : acc.or(define(libType))
    }, null)
    if (isOptional) {
      schema[prop].optional()
    }
    if (isNullable) {
      schema[prop].nullable()
    }
  }

  return z.array(z.object(schema))
}

/**
 * Get schema file contents which validate the rows given to `inferTypes()`.
 * @param {object} options - File options.
 * @param {object[]|[]} options.rows - Array of objects to evaluate.
 * @param {string} [options.name] - Name of the schema variable. Defaults to "schema".
 * @param {boolean} [options.withImport] - Whether or not to include the import statement.
 * @param {boolean} [options.withExport] - Whether or not to include the export statement.
 * @returns {string} Schema file contents.
 */
function getFile({ rows, name = 'schema', withImport, withExport }) {
  const foundTypes = inferTypes(rows)
  const lines = []

  if (withImport) {
    lines.push(fileHeader())
  }

  lines.push(`const ${name} = z.array(z.object({`)

  for (const prop in foundTypes) {
    let propText = '    '
    if (prop.indexOf(' ') > -1) {
      propText += `"${prop}": `
    } else {
      propText += `${prop}: `
    }
    let zodTypes = Object.keys(foundTypes[prop])
    if (0 === zodTypes.length) {
      propText += 'z.unknown()'
    } else if (1 === zodTypes.length) {
      propText += defineForFile(zodTypes[0]) + ','
    } else {
      const isOptional = zodTypes.includes('optional')
      const isNullable = zodTypes.includes('null')
      if (isOptional) {
        zodTypes = zodTypes.filter((zodType) => zodType !== 'optional')
      }
      if (isNullable) {
        zodTypes = zodTypes.filter((zodType) => zodType !== 'null')
      }

      propText += defineForFile(zodTypes.shift())
      for (const zodType of zodTypes) {
        propText += '.or(' + defineForFile(zodType) + ')'
      }
      if (isOptional) {
        propText += '.optional()'
      }
      if (isNullable) {
        propText += '.nullable()'
      }
      propText += ','

      lines.push(propText)
    }
  }

  lines.push('}));')

  if (withExport) {
    lines.push(fileFooter(name))
  }

  return lines.join('\n') + '\n'
}

module.exports = {
  get,
  getFile,
  fileHeader,
  fileFooter,
}
