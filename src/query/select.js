/**
 * Create a sheet query object used to execute a SheetQuery function call.
 * @param {object} options - Query options.
 * @param {string[]} [options.select] - Which object properties to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @param {object[]} [options.rows] - Rows to immediately execute the query on.
 */
function SelectQuery({ select, where }) {
    if (!select) select = []
    if (!where) where = false
    Object.defineProperties(this, {
        select: { value: Object.freeze(JSON.parse(JSON.stringify(select))) }, // Highest referential integrity.
        where: { value: Object.freeze(JSON.parse(JSON.stringify(where))) } // Highest referential integrity.
    })
}
SelectQuery.prototype = {
    handle: function(rows) {
        let results = !this.where
            ? rows
            : rows.filter(row => {
                for (let key in this.where) {
                    if (row[key] !== this.where[key]) {
                        return false
                    }
                }
                return true
            })
        return !this.select.length
            ? results
            : results.map(row => {
                let selected = {}
                for (let key in this.select) {
                    selected[key] = row[key]
                }
            })
    }
}

module.exports = { SelectQuery }