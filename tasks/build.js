#!/usr/bin/env node
const { WorkBookSheetToFile } = require('../src/write')
const config = require('../package.json').config?.build || {}
const arglist = ['dest', 'src', 'sheet', 'select', 'where', 'force', 'pretty']
const options = arglist.reduce((values, arg) => {
        const key = `npm_config_${arg}`
        if (process.env.hasOwnProperty(key)) {
            values[arg] = process.env[key]
        } else if (config.hasOwnProperty(arg)) {
            values[arg] = config[key]
        }
    }, {})
for (let i = 0; i < filters.length; i++) {
    const filter = filters[i];
    WorkBookSheetToFile(filter)
}
