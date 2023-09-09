/**
 * Adapter class for schema language integrations to extend.
 * @author Zachary K. Watkins <zwatkins.it@gmail.com>
 * @year 2023
 */

/**
 * Infer a JavaScript schema object from rows.
 */
export class Adapter {
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
        return value === null ? 'nullable' : 'object'
      default:
        return 'unknown'
    }
  }

  /**
   * Translate a cell schema name to a schema object.
   * Evaluates each cell in the workbook sheet.
   * @param {any} cellSchema - Sheet cell schema from `this.cellSchema(value)`.
   * @returns {object|undefined} Schema object.
   */
  #cellTypeSchema(cellSchema) {
    switch (cellSchema) {
      case 'string':
        return String
      case 'integer':
        return Number
      case 'float':
        return Number
      case 'boolean':
        return Boolean
      case 'optional':
        return undefined
      case 'nullable':
        return null
      case 'object':
        return Object
      default:
        return undefined
    }
  }

  /**
   * Get the string representation of a cell's type for use in a schema file.
   * @param {any} value - Schema type name.
   * @returns {string} Schema type string.
   */
  #cellTypeSchemaFile(value) {
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
   * Convert a sheet's rows to an object representing the sheet's column names and all types used by the column among the given rows.
   * @param {object[]|[]} rows - Sheet rows as [{["column header"]: (cell value)}].
   * @returns {object} Object with column headers as keys and complete column schema objects as values.
   */
  #inferTypes(rows) {
    return rows.reduce((types, row) => {
      for (const prop in row) {
        if (types[prop] === undefined) {
          types[prop] = {}
        }
        let schemaType = this.cellType(row[prop])
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
   * @returns {object} Schema definition.
   */
  getSchema(rows) {
    const inferredTypes = this.inferTypes(rows)
    const schema = {}
    for (const prop in inferredTypes) {
      const types = Object.keys(inferredTypes[prop])
      schema[prop] = types.reduce((acc, type) => {
        if ('optional' !== type && 'null' !== type) {
          acc.push(this.cellTypeSchema(type))
        }
        return acc
      }, [])
      if (types.includes('null')) {
        schema[prop].push(this.cellTypeSchema('null'))
      }
      if (!types.includes('optional')) {
        schema[prop].push(this.cellTypeSchema('optional'))
      }
    }
    return schema
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
    const inferredTypes = inferTypes(rows)
    const lines = []

    if (header) {
      lines.push(this.fileHeader(header))
    }

    lines.push(`const ${name} = {`)

    for (const prop in inferredTypes) {
      let propText = '    '
      if (prop.indexOf(' ') > -1) {
        propText += `"${prop}": `
      } else {
        propText += `${prop}: `
      }
      let propTypes = Object.keys(inferredTypes[prop])
      if (0 === propTypes.length) {
        propText += 'z.unknown()'
      } else if (1 === propTypes.length) {
        propText += defineForFile(propTypes[0]) + ','
      } else {
        const isOptional = propTypes.includes('optional')
        const isNullable = propTypes.includes('null')
        if (isOptional) {
          propTypes = propTypes.filter((propType) => propType !== 'optional')
        }
        if (isNullable) {
          propTypes = propTypes.filter((propType) => propType !== 'null')
        }

        propText += defineForFile(propTypes.shift())
        for (const propType of propTypes) {
          propText += '.or(' + defineForFile(propType) + ')'
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

    lines.push('};')

    if (footer) {
      lines.push(this.fileFooter(footer))
    }

    return lines.join('\n') + '\n'
  }
}

export default { Adapter }
