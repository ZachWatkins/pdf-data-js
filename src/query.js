/**
 * Select some properties for an array of objects.
 * @param {string[]} select - Which object properties to select.
 * @param {object[]} rows - Objects to select properties from.
 * @returns {object[]}
 */
function select(select, rows) {
    if (!select || !select.length) return rows
    return rows.map(row => select.reduce((props, key) => {
        props[key] = row[key]
        return props
    }, {}))
}

/**
 * Only select rows having given property values.
 * @param {object} options.where - Only select objects having these property values.
 * @param {object[]} options.rows - Rows to immediately execute the query on.
 * @returns {object[]}
 */
function where(where, rows) {
    console.log('where', where)
    if (!where || !Object.keys(where).length) return rows
    return rows.filter(row => {
        for (let key in where) {
            if (row[key] !== where[key]) {
                return false
            }
        }
        return true
    })
}

module.exports = { select, where }
