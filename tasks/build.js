#!/usr/bin/env node
const options = {
    src: undefined,
    sheet: undefined,
    dest: undefined,
    select: [],
    where: {}
};
const package = require('../package.json')
const { WorkBookSheetToFile } = require('../src/workbook/write')
const filters = Array.isArray(package.config.data.filtered)
    ? package.config.data.filtered
    : [package.config.data.filtered]
for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    WorkBookSheetToFile(filter)
}
