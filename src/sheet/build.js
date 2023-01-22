const XLSX = require('xlsx')
const Query = require('./query')
const path = require('path')

/**
 * Construct a configuration object for building a file.
 * @param {object} options - Build configuration options.
 * @param {string} options.src - Source worksheet file.
 * @param {string} options.dest - Destination worksheet file.
 * @returns {void}
 */
function BuildConfig({ src, dest }) {
    this.errors = []
    if (!src) this.errors.push(new Error('A source path was not provided.'))
    if (!dest) this.errors.push(new Error('A destination path was not provided.'))

    Object.defineProperties(this, {
        src: { value: path.resolve(src) },
        dest: { value: path.resolve(dest) },
    })
}

/**
 * Construct a configuration object for building a filtered worksheet file.
 * @param {object} options - Build configuration options.
 * @param {string} options.src - Source worksheet file.
 * @param {string} options.dest - Destination workbook file path.
 * @param {string} [options.sheet] - Destination workbook sheet name. Default 'Sheet'.
 * @param {object} [query] - A query object to apply to the workbook data before saving it at the destination. Overrides the "srcSheet" option.
 * @returns {BuildConfig}
 * @example `new BuildConfig(options)`
 */
function QueriedWorkbook({ src, dest, sheet, query }) {
    const build = new BuildConfig({ src, dest })
    if (build.errors.length) return build.errors
    const workbook = XLSX.readFileSync(build.src)
    const rows = Query.Workbook({ workbook, query })
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(
        wb,
        XLSX.utils.json_to_sheet(rows),
        sheet || 'Sheet'
    )
    XLSX.writeFileXLSX(wb, dest)
}

module.exports = { QueriedWorkbook }
