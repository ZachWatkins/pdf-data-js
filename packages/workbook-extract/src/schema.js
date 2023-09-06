/**
 * Create a schema file from a given array of JSON data.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import { jsonToZod } from 'json-to-zod'

/**
 * Return the schema file contents for a Zod schema file that validates the given data set.
 * @param {mixed} data
 * @returns {string} - The schema file contents.
 */
export function ToSchemaFile(data) {
  const schema = jsonToZod(data)
  return schema
}

export default { ToSchemaFile }
