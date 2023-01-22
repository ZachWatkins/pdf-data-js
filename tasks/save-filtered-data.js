const package = require('../package.json')
const saveFilteredWorkbook = require('../src/save-filtered-workbook')

saveFilteredWorkbook(package.config.data.filtered)
