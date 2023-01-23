const XLSX = require('xlsx')
const Query = require('./read')
const path = require('path')
const { WriteJsonFile } = require('../write')
const { GetWorkSheetRows } = require('./read')

/**
 * Save WorkSheet rows to a JSON file.
 * @param {object} options - Read options.
 * @param {string} options.dest - Where to write the JSON file.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @param {boolean} [options.pretty=true] - Whether to indent the JSON file contents.
 * @returns {void}
 */
function WorkBookSheetToJsonFile({ src, workbook, sheet, select, where, dest, pretty }) {
    let data = GetWorkSheetRows({ src, workbook, sheet, select, where })
    pretty = pretty || true
    WriteJsonFile({ data, dest, pretty })
}

/**
 * Save WorkSheet rows to a JSON file.
 * @param {object} options - Read options.
 * @param {string} options.dest - Where to write the JSON file.
 * @param {string} [options.sheet='Sheet'] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @param {boolean} [options.pretty=true] - Whether to indent the JSON file contents.
 * @returns {void}
 */
function WorkBookSheetToFile({ src, workbook, sheet, select, where, dest }) {
    let data = GetWorkSheetRows({ src, workbook, sheet, select, where })
    const workbook = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
        workbook,
        XLSX.utils.json_to_sheet(data),
        sheet || 'Sheet'
    )
    XLSX.writeFileXLSX(workbook, dest)
}

module.exports = { WorkBookSheetToFile, WorkBookSheetToJsonFile }
