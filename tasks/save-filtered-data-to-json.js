const workbookToJson = require('../src/workbook-to-json')
const package = require('../package.json')
workbookToJson({
    src: package.config.data.filtered.dest,
    dest: package.config.data.filtered.json,
    sheet: package.config.data.filtered.sheet
})
