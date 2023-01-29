/**
 * File build controller.
 * @author  Zachary K. Watkins
 * @created 2023-01-24 9:53PM CST
 * @package @zachwatkins/pdf-data-viz-js
 */
const { Config } = require('./config')
const { WorkBook, WriteJsonFile } = require('./write')

class Build {
    /**
     * Build files using configuration parameters.
     * @param {object} options - Write options.
     * @param {string|string[]} options.dest - Where to write the file.
     * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
     * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
     * @param {string[]} [options.select] - Columns to select.
     * @param {object} [options.where] - Only select objects having these property values.
     * @param {boolean} [options.force=false] Whether to replace an existing local file.
     * @param {boolean} [options.pretty] - Whether to indent JSON file contents.
     */
    constructor(options) {
        const config = this.config(options)
        const workbook = new WorkBook(src)
        let jsondest = options.dest.replace(/\.xlsx$/ig, '.json')
        let xlsxdest = options.dest.replace(/\.json$/ig, '.xlsx')
        let data = GetWorkSheetRows({ workbook, sheet: options.sheet, select, where })
        config.each(config => {
            this.json({ data, dest: config.dest, force: config.force, pretty: config.pretty })
            write.WorkBookSheetT-oFile(config)
        })
    }
    json({ data, dest, pretty, force }){
        dest.filter(path => 0 <= path.indexOf(/\.json$/i))
            .ForEach(path => {
                WriteJsonFile({ data, dest, pretty, force })
            })
    }

    /**
     * Build files using configuration parameters.
     * @param {object} options - Write options.
     * @param {string|string[]} options.dest - Where to write the file.
     * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
     * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
     * @param {string[]} [options.select] - Columns to select.
     * @param {object} [options.where] - Only select objects having these property values.
     * @param {boolean} [options.force=false] Whether to replace an existing local file.
     * @param {boolean} [options.pretty] - Whether to indent JSON file contents.
     * @returns {Config}
     */
    config({ dest, src, sheet, select, where, force, pretty }) {
        return new Config({
            values: { dest, src, sheet, select, where, force, pretty },
            keys: ['dest', 'src', 'sheet', 'select', 'where', 'force', 'pretty'],
            defaults: { pretty: true, force: false },
            depthMax: 1,
            callback: (config) => {
                if (config.dest && ! Array.isArray(config.dest)) {
                    config.dest = [config.dest]
                }
            }
        })
    }
}

module.exports = { Build }
