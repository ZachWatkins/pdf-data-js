/**
 * FileAdapter class for generating schema file content for a sheet.
 * @author Zachary K. Watkins <zwatkins.it@gmail.com>
 * @year 2023
 */
export class FileAdapter {
  schemaLang = 'base'

  constructor() {}

  #isFloat(n) {
    return Number(n) === n && n % 1 !== 0
  }

  /**
   * Get the name of a cell's schema.
   * @param {any} value - Value to evaluate.
   * @returns {string} Schema type name.
   */
  #cellType(value) {
    switch (typeof value) {
      case 'string':
        return 'string'
      case 'number':
        return this.isFloat(value) ? 'float' : 'integer'
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
   * Get the string representation of a cell's type for use in a schema file.
   * @param {any} value - Schema type name.
   * @returns {string} Schema type string.
   */
  #cellTypeSchema(value) {
    switch (schemaType) {
      case 'string':
        return 'String'
      case 'integer':
        return 'Number'
      case 'float':
        return 'Number'
      case 'boolean':
        return 'Boolean'
      case 'optional':
        return 'undefined'
      case 'null':
        return 'null'
      case 'object':
        return 'Object'
      default:
        return JSON.stringify(value)
    }
  }

  /**
   * Get the header text for a schema file.
   * @param {object} options - Schema file header options.
   * @returns {string} Schema file header.
   */
  fileHeader({}) {
    return ''
  }

  /**
   * Get the footer text for a schema file.
   * @param {object} options - Schema file footer options.
   * @returns {string} Schema file footer.
   */
  fileFooter({}) {
    return ''
  }

  /**
   * Get file contents which declare a schema for the given sheet rows.
   * @param {object[]|[]} rows - Array of sheet row objects to evaluate.
   * @param {object} options - File options.
   * @param {string} [options.name] - Name of the schema variable. Defaults to "schema".
   * @param {object} [options.header] - If provided, prepends return value from `this.fileHeader(options.header)`.
   * @param {object} [options.footer] - If provided, appends return value from `this.fileFooter(options.footer)`.
   */
  getSchemaFile(rows, options = {}) {
    const { name, header, footer } = { name: 'schema', ...options }
    const inferredTypes = this.inferTypes(rows)
    const lines = []

    if (header) {
      lines.push(this.fileHeader(header))
    }

    lines.push(`const ${name} = {`)

    for (const prop in inferredTypes) {
      // Sorts types so null and optional are at the end of the array, and optional is at the very end of the array when present.
      let types = Object.keys(inferredTypes[prop]).sort((a, b) =>
        'optional' === a
          ? 1
          : 'optional' === b
          ? -1
          : 'null' === a
          ? 1
          : 'null' === b
          ? -1
          : 0
      )
      let propKey = prop.indexOf(' ') > -1 ? `"${prop}"` : prop
      lines.push(
        `    ${propKey}: [` +
          types
            .reduce((acc, type) => {
              acc.push(this.cellTypeSchemaFile(type))
              return acc
            }, [])
            .join(', ') +
          '],\n'
      )
    }

    lines.push('};')

    if (footer) {
      lines.push(this.fileFooter(footer))
    }

    return lines.join('\n') + '\n'
  }
}

export default { FileAdapter }
