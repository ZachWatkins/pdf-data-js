const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')
const Query = require('./query')
const { GetWorkBook, GetWorkSheetRows } = require('./read')

/**
 * Write data to a JSON file.
 * @param {object} options - Write options.
 * @param {any} options.data - File contents.
 * @param {string} options.dest - Where to write the file.
 * @param {boolean} [options.force=false] Whether to replace an existing local file.
 * @param {boolean} [options.pretty=false] - Whether to indent JSON file contents.
 * @returns {void|Error}
 * @param {*} param0
 */
function WriteJsonFile({ data, dest, pretty, force }) {
    force = force || false
    if (!force && fs.existsSync(dest)) {
        return new Error('Destination file exists. Use force:true to override.')
    }
    pretty = pretty || false
    const json = !pretty
        ? JSON.stringify(data)
        : JSON.stringify(data, null, 4)
    fs.writeFile(dest, json, {encoding: 'utf8'}, () => {
        console.log(`Created: ${path.basename(dest)}`)
    })
}

/**
 * Save WorkSheet rows to a JSON file.
 * @param {object} options - Read options.
 * @param {string} options.dest - Where to write the file.
 * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @param {boolean} [options.force=false] Whether to replace an existing local file.
 * @param {boolean} [options.pretty] - Whether to indent JSON file contents.
 * @returns {void|Error}
 */
function WorkBookSheetToFile({ dest, src, workbook, sheet, select, where, pretty, force }) {
    force = force || false
    workbook = workbook || GetWorkBook({ src })
    sheet = sheet || Object.keys(workbook.SheetNames)[0]
    let data = GetWorkSheetRows({ workbook, sheet, select, where })
    if ('.json' === path.extname(dest)) {
        results = WriteJsonFile({ data, dest, pretty, force })
    } else {
        force = force || false
        if (!force && fs.existsSync(dest)) {
            return new Error('Destination file exists. Use force:true to override.')
        }
        const newworkbook = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(
            newworkbook,
            XLSX.utils.json_to_sheet(data),
            sheet
        )
        XLSX.writeFileXLSX(newworkbook, dest)
    }
}

module.exports = { WriteJsonFile, WorkBookSheetToFile }
