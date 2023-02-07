#!/usr/bin/env node
/**
 * File build controller.
 * @author  Zachary K. Watkins
 * @created 2023-01-24 9:53PM CST
 * @package @zachwatkins/pdf-data-js
 */
const fs = require('fs')
const path = require('path')
const XLSX = require('xlsx')
const config = require('../package.json')?.config?.build || []
const builddir = path.resolve(`${__dirname}/../build`)
if (!fs.existsSync(builddir)) {
    fs.mkdirSync(builddir)
}

function Build(list) {
    if (Array.isArray(list)) {
        list.forEach(config => {
            const workbook = new WorkBook(config)
            workbook.build()
        })
    } else {
        const workbook = new WorkBook(list)
        workbook.build()
    }
}

class WorkBook {
    /**
     * Build files using configuration parameters.
     * @param {object} options - Workbook build options.
     * @param {string} options.name - Workbook name.
     * @param {string} options.file - WorkBook file path.
     * @param {boolean} options.locked - Whether to rebuild an existing WorkBook.
     * @param {array}  options.sheets - WorkBook sheet build definitions.
     */
    constructor({ name, file, locked, sheets }) {
        this.name = name
        this.file = path.resolve(`${__dirname}/../${file}`)
        this.sheets = sheets || []
        this.locked = locked || false
    }

    build() {
        const exists = fs.existsSync(this.file)
        if (exists && this.locked) {
            return
        }
        const workbook = exists
            ? XLSX.readFileSync(this.file)
            : XLSX.utils.book_new()
        let sources = {}
        this.sheets.forEach(sheet => {
            let { name, source, select, from, where, orderBy } = sheet

            // Retrieve WorkBook object.
            if (!sources[source]) {
                sources[source] = XLSX.readFileSync(path.resolve(`${__dirname}/../${source}`))
            }

            if (!from) {
                from = sources[source].SheetNames[0]
            }

            // Select rows.
            let rows = XLSX.utils.sheet_to_json(sources[source].Sheets[from])
            if (where) {
                rows = this.where(where, rows)
            }
            if (select && Array.isArray(select) && select.length) {
                rows = this.select(select, rows)
            }
            if (orderBy) {
                rows = this.orderBy(orderBy, rows)
            }

            // Build files.
            const worksheet = XLSX.utils.json_to_sheet(rows)
            let sheetName = name || from

            if (!workbook.Sheets[sheetName]) {
                XLSX.utils.book_append_sheet(workbook, worksheet, sheetName)
            } else {
                workbook.Sheets[sheetName] = worksheet
            }
            // Write the CSV file.
            fs.writeFile(
                this.file.replace('.xlsx', `.${sheetName.toLowerCase()}.csv`),
                XLSX.utils.sheet_to_csv(worksheet),
                {encoding: 'utf8'},
                () => {}
            )
            // Write the JSON file.
            const jsonData = JSON.stringify(rows, null, 4)
            fs.writeFile(
                this.file.replace('.xlsx', `.${sheetName.toLowerCase()}.json`),
                jsonData,
                {encoding: 'utf8'},
                () => {}
            )
            // Write the JS file.
            fs.writeFile(
                this.file.replace('.xlsx', `.${sheetName.toLowerCase()}.js`),
                `const ${this.name.replace(/\s+/, '')}_${sheetName.replace(/\s+/, '')} = ${jsonData}`,
                {encoding: 'utf8'},
                () => {}
            )
        })
        XLSX.writeFileXLSX(workbook, this.file)
    }

    where(opts, rows) {
        if (!Array.isArray(opts[0])) {
            return rows.filter(row => row[opts[0]] === opts[1])
        }
        opts.forEach(opt => {
            rows = rows.filter(row => row[opt[0]] === opt[1])
        })
        return rows;
    }

    select(opts, rows) {
        return rows.map(row => opts.reduce((props, key) => {
            props[key] = row[key]
            return props
        }, {}))
    }

    orderBy(opts, rows) {
        if (!Array.isArray(opts[0])) {
            if ("descending" === opts[1]) {
                return rows.sort(this.sortDescending.bind(this, opts[0]))
            } else {
                return rows.sort(this.sortAscending.bind(this, opts[0]))
            }
        }
        opts.forEach(opt => {
            if ("descending" === opt[1]) {
                rows.sort(this.sortDescending.bind(this, opt[0]))
            } else {
                rows.sort(this.sortAscending.bind(this, opt[0]))
            }
        })
        return rows;
    }

    sortAscending(prop, a, b) {
        a = a[prop]
        b = b[prop]
        if (a === b) return 0
        if (typeof a === 'number' || typeof b === 'number') {
            a = a || 0
            b = b || 0
            return a - b
        }
        a = a ? a.toUpperCase() : ''
        b = b ? b.toUpperCase() : ''
        if (a < b) {
            return -1
        }
        if (a > b) {
            return 1
        }
        return 0
    }

    sortDescending(prop, a, b) {
        a = a[prop]
        b = b[prop]
        if (a === b) return 0
        if (typeof a === 'number' || typeof b === 'number') {
            a = a || 0
            b = b || 0
            return b - a
        }
        a = a ? a.toUpperCase() : ''
        b = b ? b.toUpperCase() : ''
        if (b < a) {
            return -1
        }
        if (b > a) {
            return 1
        }
        return 0
    }
}

/**
 * Write data to a JSON file.
 * @param {object} options - Write options.
 * @param {any} options.data - File contents.
 * @param {string} options.file - Destination file path.
 * @param {boolean} [options.pretty=false] - Whether to indent JSON file contents.
 * @param {boolean} [options.force=false] - Whether to replace an existing local file.
 * @returns {void}
 * @throws {Error}
 */
function WriteJsonFile({ data, file, pretty, force }) {
    data = data || ''
    file = path.resolve(`${__dirname}/../${file}`)
    pretty = pretty || true
    force = force || false
    if (!force && fs.existsSync(file)) {
        throw new Error(`File exists at ${file}. Use force:true to override.`)
    }
    const json = !pretty
        ? JSON.stringify(data)
        : JSON.stringify(data, null, 4)
    fs.writeFile(file, json, {encoding: 'utf8'}, () => {
        console.log(`Created: ${path.basename(file)}`)
    })
}

Build(config)
