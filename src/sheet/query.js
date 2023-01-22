const { SelectQuery } = require('../query/select')

/**
 * Execute a query object on a workbook and return the resulting rows.
 * @param {object} options - Query options.
 * @param {import('xlsx').WorkBook} options.workbook - Source workbook.
 * @param {object} options.query - The query parameters.
 * @returns {object[]} Rows of workbook data.
 */
function Workbook({ workbook, query }) {
    const sheet = query && query.sheet
        ? query.sheet
        : Object.keys(workbook.SheetNames)[0]
    const worksheet = workbook.Sheets[sheet]
    let rows = XLSX.utils.sheet_to_json(worksheet)
    const query = new SelectQuery({ select, where })
    return query.handle(rows)
}

module.exports = { Workbook }
