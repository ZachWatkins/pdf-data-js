/**
 * Adapter class for schema language integrations to extend.
 * @author Zachary K. Watkins <zwatkins.it@gmail.com>
 * @year 2023
 */

/**
 * Infer a JavaScript schema object from rows.
 */
export class Adapter {
  fileExtension = '.schema.js'

  constructor() {}

  #isFloat(n) {
    return Number(n) === n && n % 1 !== 0
  }

  /**
   * Get the name of an object property's schema.
   * @param {any} value - Value to evaluate.
   * @returns {string} Schema type name.
   */
  propType(value) {
    switch (typeof value) {
      case 'string':
        return 'string'
      case 'number':
        return this.#isFloat(value) ? 'float' : 'integer'
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
   * Combine one or more cell types for a column into a schema definition.
   * @param {{[key: string]: boolean}} types - Object with cell types as keys and boolean values.
   * @returns {any} A schema value for a column which fits the adapter's schema language.
   */
  columnSchema(types) {
    const typeNames = Object.keys(types).sort((a, b) =>
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
    return typeNames.reduce((acc, type) => {
      switch (type) {
        case 'string':
          acc.push(String)
        case 'integer':
          acc.push(Number)
        case 'float':
          acc.push(Number)
        case 'boolean':
          acc.push(Boolean)
        case 'optional':
          acc.push(undefined)
        case 'null':
          acc.push(null)
        case 'object':
          acc.push(Object)
        default:
          acc.push(type)
      }
      return acc
    }, [])
  }

  /**
   * Create the contents of a schema file from an object with cell column headers for keys and {[propType]: true} collections for values.
   * @param {{[column: string]: {[propType: string]: boolean}}} types - Object with cell column headers for keys and {[propType]: true} collections for values.
   * @param {object} options - File options.
   * @returns {string} Schema file contents for an array of objects which conforms to the adapter's schema language.
   */
  getFileContents(types, options = {}) {
    const { name = 'schema', withImport, withExport } = options
    const lines = []

    if (withImport) {
      lines.push(this.fileHeader())
    }

    lines.push(`const ${name} = {`)

    for (const prop in types) {
      // Sorts types so null and optional are at the end of the array, and optional is at the very end of the array when present.
      let types = Object.keys(types[prop]).sort((a, b) =>
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
              acc.push(this.cellTypeSchema(type))
              return acc
            }, [])
            .join(', ') +
          '],\n'
      )
    }

    lines.push('};')

    if (withExport) {
      lines.push(`export default ${name}`)
    }

    return lines.join('\n') + '\n'
  }

  /**
   * Get the header text for a schema file.
   * @param {object} options - Schema file header options.
   * @returns {string} Schema file header.
   */
  fileHeader(options) {
    return ''
  }

  /**
   * Get the footer text for a schema file.
   * @param {object} options - Schema file footer options.
   * @returns {string} Schema file footer.
   */
  fileFooter(options) {
    return 'export default schema'
  }
}

export default { Adapter }
