/**
 * Zod schema adapter.
 * @author Zachary K. Watkins <zwatkins.it@gmail.com>
 * @year 2023
 */
import { Adapter } from '../adapter.js'
import { z } from 'zod'

class ZodAdapter extends Adapter {
  
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
 * Get a schema object which validates the given rows.
 * @param {object[]|[]} rows - Array of objects to evaluate.
 * @returns {z.ZodArray} Zod schema for an array of objects.
 */
function get(rows) {
  const foundTypes = inferTypes(rows)

  for (const prop in foundTypes) {
    foundTypes[prop] = propTypesToSchema(foundTypes[prop])
  }

  return wrapSchema(propTypesToSchema(foundTypes))
}

function wrapSchema(schema) {
  return z.array(z.object(schema))
}

/**
 * Translates the types found for a given row column into a column schema.
 * @param {object} propTypes - Object with one or more schema types as keys and "true" as values.
 * @returns {z.ZodType<any, any>}
 */
function propTypesToSchema(propTypes) {
  const types = Object.keys(propTypes)
  const schema = types.reduce((acc, type) => {
    switch (type) {
      case 'optional':
      case 'null':
        return acc
      case null:
        return define(type)
      default:
        return acc.or(define(type))
    }
  }, null)
  if (types.includes('optional')) {
    schema.optional()
  }
  if (types.includes('null')) {
    schema.nullable()
  }
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
