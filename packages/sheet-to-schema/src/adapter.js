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
}

export default { Adapter }
