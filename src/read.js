const query = require('./query')
const XLSX = require('xlsx')

/**
 * Retrieve a WorkBook from a file path.
 * @param {string} src - WorkBook file path.
 * @returns {import('xlsx').WorkBook} WorkBook object.
 */
function GetWorkBook(src) {
    return XLSX.readFileSync(src)
}

/**
 * Select a Worksheet from a WorkBook.
 * @param {object} options - Read options.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.src] - WorkBook file path.
 * @returns {import('xlsx').WorkSheet} WorkSheet object.
 */
function GetWorkSheet({ sheet, src, workbook }) {
    workbook = workbook || GetWorkBook(src)
    sheet = sheet || Object.keys(workbook.SheetNames)[0]
    const worksheet = workbook.Sheets[sheet]
}

/**
 * Select Worksheet rows from a WorkBook.
 * @param {object} options - Read options.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @returns {object[]} Rows.
 */
function GetWorkSheetRows({ sheet, src, workbook, select, where }) {
    const worksheet = GetWorkSheet({ sheet, src, workbook })
    let rows = XLSX.utils.sheet_to_json(worksheet)
    if (where) rows = query.where(where, rows)
    if (select) rows = query.select(select, rows)
    return rows
}

module.exports = { GetWorkBook, GetWorkSheetRows }
