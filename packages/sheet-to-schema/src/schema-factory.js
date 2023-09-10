/**
 * Create a schema from workbook data using a schema adapter.
 * @author Zachary K. Watkins <zwatkins.it@gmail.com>
 * @year 2023
 */

import fs from 'fs'
import path from 'path'
import { Adapter } from './adapter.js'

export class SchemaFactory {
  #adapter = null
  #propTypes = null
  #filename = ''
  #sheet = ''
  #workbookFilename = ''
  #directory = ''
  #overwrite = false
  #fileContentOptions = {}

  /**
   * Create a new instance.
   * @param {object} [options] - Options for the factory instance.
   * @returns {SchemaFactory} The factory instance.
   */
  constructor(options) {
    this.adapter(options.adapter || new Adapter())
    if (options) {
      if (options.rows) {
        this.rows(options.rows)
      }
      if (options.sheet) {
        this.sheet(options.sheet)
      }
      if (options.workbook) {
        this.workbook(options.workbook)
      }
      if (options.filename) {
        this.filename(options.filename)
      }
      if (options.directory) {
        this.directory(options.directory)
      }
      if (options.overwrite) {
        this.overwrite(options.overwrite)
      }
      if (options.fileOpts) {
        this.fileOpts(options.fileOpts)
      }
    }
  }

  /**
   * Get a new instance.
   * @param {object} [options] - Options for the factory instance.
   * @returns {SchemaFactory} The factory instance.
   */
  static make(options) {
    return new SchemaFactory(options)
  }

  /**
   * Set the adapter instance to use for schema creation.
   * @param {Adapter} adapter - Adapter instance.
   * @returns {SchemaFactory} The factory instance.
   * @throws {Error} Throws an error if the adapter is not an instance of Adapter.
   */
  adapter(adapter) {
    if (!(adapter instanceof Adapter)) {
      throw new Error('The adapter must be an instance of `Adapter`.')
    }
    this.#adapter = adapter
    return this
  }

  /**
   * Interpret rows of data into one or more types for a column.
   * @param {object[]|[]} rows - Sheet rows as [{["column header"]: (cell value)}].
   * @returns {SchemaFactory} The factory instance.
   */
  rows(rows) {
    this.#propTypes = rows.reduce((types, row) => {
      for (const prop in row) {
        if (types[prop] === undefined) {
          types[prop] = {}
        }
        let schemaType = this.#adapter.propType(row[prop])
        if (types[prop][schemaType] === undefined) {
          types[prop][schemaType] = true
        }
      }
      return types
    }, {})
    return this
  }

  /**
   * Set the name of the workbook sheet to use in the generated schema filename.
   * @param {string} sheet - Workbook sheet name.
   * @returns {SchemaFactory} The factory instance.
   */
  sheet(sheet) {
    this.#sheet = sheet
    return this
  }

  /**
   * Set the filename of the workbook to use in the generated schema filename.
   * @param {string} workbookFilename - Workbook filename.
   * @returns {SchemaFactory} The factory instance.
   */
  workbook(workbookFilename) {
    this.#workbookFilename = workbookFilename
    return this
  }

  /**
   * Set the filename to use for the schema file.
   * @param {string} filename - Filename to use for the schema file.
   * @returns {SchemaFactory} The factory instance.
   */
  filename(filename) {
    this.#filename = filename
    return this
  }

  /**
   * Set the directory to write files to.
   * @param {string} dir - Directory to write files to.
   * @returns {SchemaFactory} The factory instance.
   */
  directory(dir) {
    this.#directory = dir
    return this
  }

  /**
   * Set whether or not to overwrite existing files.
   * @param {boolean} overwrite - Whether or not to overwrite existing files.
   * @returns {SchemaFactory} The factory instance.
   */
  overwrite(overwrite) {
    this.#overwrite = overwrite
    return this
  }

  /**
   * Set options to be passed to the adapter's `getFileContents` method.
   * @param {object} options - Options to be passed to the adapter's `getFileContents` method.
   * @returns {SchemaFactory} The factory instance.
   */
  fileOpts(options) {
    this.#fileContentOptions = options
    return this
  }

  /**
   * Write a schema file using the adapter.
   * @param {undefined|string|object} [options] - Filename to use for the schema file, or options for the schema file.
   * @returns {SchemaFactory} The factory instance.
   */
  writeFile(options) {
    if (typeof options === 'string') {
      this.filename(options)
    } else if (typeof options === 'object') {
      this.fileOpts(options)
    }
    this.#resolveOptions()

    if (!this.#adapter.getFileContents) {
      throw new Error(
        'The adapter must implement a `getFileContents` method which returns a string for the schema file contents.'
      )
    }

    const destination = path.resolve(this.#directory, this.#filename)

    if (fs.existsSync(destination)) {
      if (!this.#overwrite) {
        throw new Error(`File "${this.#filename}" already exists.`)
      } else {
        fs.unlinkSync(destination)
      }
    }

    fs.writeFileSync(
      destination,
      this.#adapter.getFileContents(this.#propTypes, this.#fileContentOptions)
    )

    return this
  }

  /**
   * Convert a sheet's rows to a schema modeling the allowed row column values.
   * @return {any} A schema value for a sheet which fits the adapter's schema language.
   */
  get() {
    const schema = {}
    for (const prop in this.#propTypes) {
      schema[prop] = this.#adapter.columnSchema(this.#propTypes[prop])
    }
    return this.#adapter.wrapSchema ? this.#adapter.wrapSchema(schema) : schema
  }

  /**
   * Resolve options for the factory instance when possible.
   * @private
   * @returns {void}
   */
  #resolveOptions() {
    if (!this.#filename) {
      if (this.#workbookFilename) {
        let file = this.#workbookFilename.substring(
          0,
          this.#workbookFilename.lastIndexOf('.')
        )
        if (this.#sheet) {
          file += `.${this.#sheet}`
        }
        this.filename(file + this.#adapter.fileExtension)
      } else if (this.#sheet) {
        this.filename(this.#sheet + this.#adapter.fileExtension)
      } else {
        throw new Error(
          'A filename, workbook filename, or sheet name must be declared.'
        )
      }
    }
  }
}

export default { SchemaFactory }
