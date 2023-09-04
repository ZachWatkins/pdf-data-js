/**
 * JavaScript module to convert a flat JSON object to a simple SQL `CREATE TABLE` statement that is ANSI-SQL compatible.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

const Schema = {
  /**
   * Output to the console a SQL statement which can create a database table from a flat JSON object.
   * The table should have a schema based on the given object's data types.
   * Expected types:
   * 1. Index
   * 2. String
   * 3. Boolean
   * 4. Integer
   * 5. Float
   * @param {object} example - A flat JSON object to use as an example for the table schema.
   */
  Create: function (example) {
    const table = {}
    const keys = Object.keys(example)
    for (let i = 0; i < keys.length; i++) {
      const key = keys[i]
      const value = example[key]
      if (typeof value === 'string') {
        table[key] = 'TEXT'
      } else if (typeof value === 'boolean') {
        table[key] = 'BOOLEAN'
      } else if (typeof value === 'number') {
        if (value % 1 === 0) {
          table[key] = 'INTEGER'
        } else {
          table[key] = 'FLOAT'
        }
      }
    }
    const sql = this.Statement(table)
    console.log(sql)
  },
  Statement: function (table) {
    const keys = Object.keys(table)
    const sql = `CREATE TABLE IF NOT EXISTS table_name (${keys
      .map((key) => `${key} ${table[key]}`)
      .join(', ')});`
    return sql
  },
}

export default Schema
