const query = require('./query')
const XLSX = require('xlsx')

class WorkBook {
    file = {
        source: undefined,
        ext: undefined
    }
    sheets = []
    /**
     * A workbook object which can be constructed from a file path.
     * @param {object} options
     * @param {string} options.source - WorkBook file path.
     */
    constructor({ source }) {
        if (source) {
            this.file = {
                source,
                ext: source.match(/\.[^.]+$/)[0]
            }
            const workbook = XLSX.readFileSync(source)
            this.sheets = workbook.SheetNames
            for (let i = 0; i < this.sheets.length; i++) {
                const name = this.sheets[i];
                this[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
            }
        }
    }
}

/**
 * Retrieve a WorkBook from a file path.
 * @param {string} source - WorkBook file path.
 * @returns {import('xlsx').WorkBook} WorkBook object.
 */
function GetWorkBook(source) {
    return XLSX.readFileSync(source)
}

/**
 * Select a Worksheet from a WorkBook.
 * @param {object} options - Read options.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.source.
 * @param {string} [options.source] - WorkBook file path.
 * @returns {import('xlsx').WorkSheet} WorkSheet object.
 */
function GetWorkSheet({ sheet, source, workbook }) {
    workbook = workbook || GetWorkBook(source)
    sheet = sheet || Object.keys(workbook.SheetNames)[0]
    return workbook.Sheets[sheet]
}

/**
 * Select Worksheet rows from a WorkBook.
 * @param {object} options - Read options.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.source.
 * @param {string} [options.source] - WorkBook file path. Required if options.workbook is not defined.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @returns {object[]} Rows.
 */
function GetWorkSheetRows({ sheet, source, workbook, select, where }) {
    const worksheet = GetWorkSheet({ sheet, source, workbook })
    let rows = XLSX.utils.sheet_to_json(worksheet)
    if (where) rows = query.where(where, rows)
    if (select) rows = query.select(select, rows)
    return rows
}

module.exports = { WorkBook, GetWorkBook, WorkBookSheets, GetWorkSheet, GetWorkSheetRows }
