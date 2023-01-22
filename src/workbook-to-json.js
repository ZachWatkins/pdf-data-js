const XLSX = require('xlsx')
const fs = require('fs')
const path = require('path')

/**
 * Save a Workbook as a JSON file.
 * @param {object} options - Save action options.
 * @param {string} options.src - Workbook file path.
 * @param {string} options.dest - JSON file path.
 */
function workbookToJson({src, dest, sheet}) {
    src = path.resolve(src)
    dest = path.resolve(dest)

    const workbook = XLSX.readFileSync(src)
    const page = XLSX.utils.sheet_to_json(workbook.Sheets[sheet])
    const json = JSON.stringify(page, null, 4)
    fs.writeFile(dest, json, {encoding: 'utf8'}, () => {
        console.log(`Created: ${path.basename(dest)}`)
    })
}

module.exports = workbookToJson
