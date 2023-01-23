const workbookToJson = require('../src/sheet-to-json-file')
const package = require('../package.json')
const filters = Array.isArray(package.config.data.filtered)
    ? package.config.data.filtered
    : [package.config.data.filtered]
for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    workbookToJson({
        src: filter.dest,
        dest: filter.json,
        sheet: filter.sheet
    })
}
