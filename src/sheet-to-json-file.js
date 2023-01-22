const XLSX = require('xlsx')
const CreateJsonFile = require('./create-json-file')
const path = require('path')

/**
 * Save a Workbook as a JSON file.
 * @param {object} options - Save action options.
 * @param {string} options.src - Workbook file path.
 * @param {string} options.dest - JSON file path.
 * @param {string} options.sheet - Workbook sheet name.
 */
function sheetToJsonFile({src, dest, sheet}) {
    const workbook = XLSX.readFileSync(path.resolve(src))
    CreateJsonFile({
        dest: path.resolve(dest),
        data: XLSX.utils.sheet_to_json(workbook.Sheets[sheet]),
        pretty: true
    })
}

module.exports = sheetToJsonFile
