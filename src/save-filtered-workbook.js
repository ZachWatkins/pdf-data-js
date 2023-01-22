const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')

/**
 * Filter a workbook into a new data set for a new workbook file.
 * @param {object} options - Filter options.
 * @param {import('xlsx').WorkBook} options.workbook - Source workbook.
 * @param {string} [options.sheet] - Name of the source workbook sheet to select from. Defaults to the first sheet.
 * @param {object} [options.only] - Key value pairs used to select rows in the sheet.
 * @returns {object[]} Rows for the new workbook.
 */
function WorkbookFilter({workbook, sheet, only}) {
    sheet = sheet || Object.keys(workbook.SheetNames)[0]
    let page = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    if (only) {
        page = page.filter(row => {
            for (let key in only) {
                if (row[key] !== only[key]) {
                    return false
                }
            }
            return true
        })
    }
    return page
}

/**
 * Save a new Workbook while using an existing one for reference.
 * @param {object} options - Options for save action.
 * @param {string} options.src - Source XLSX file.
 * @param {string} options.dest - Destination file path.
 * @param {string} [options.sheet='Sheet'] - Destination sheet name.
 * @param {object} [options.filter] - Options to filter workbook data by a sheet and rows.
 * @param {string} [options.filter.sheet] - Workbook sheet name to select rows from.
 * @param {object} [options.filter.only] - Key value pairs used to select rows in the sheet.
 * @returns {object[]} - Rows to save to a new workbook.
 */
function saveFilteredWorkbook({src, dest, sheet, filter}) {
    src = path.resolve(src)
    dest = path.resolve(dest)
    sheet = sheet || 'Sheet'
    filter = filter || {}

    const wb = XLSX.readFileSync(src)
    const rows = WorkbookFilter({
        ...filter,
        workbook: wb,
    })
    const workbook = XLSX.utils.book_new()
    const worksheet = XLSX.utils.json_to_sheet(rows)
    XLSX.utils.book_append_sheet(workbook, worksheet, sheet, true)
    XLSX.writeFileXLSX(workbook, dest)
}

module.exports = saveFilteredWorkbook
