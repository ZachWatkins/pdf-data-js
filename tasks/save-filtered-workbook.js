const package = require('../package.json')
const saveFilteredWorkbook = require('../src/save-filtered-workbook')
const filters = Array.isArray(package.config.data.filtered)
    ? package.config.data.filtered
    : [package.config.data.filtered]
for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    saveFilteredWorkbook(filter)
}
