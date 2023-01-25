/**
 * File build controller.
 * @author  Zachary K. Watkins
 * @created 2023-01-24 9:53PM CST
 * @package @zachwatkins/pdf-data-viz-js
 */
const { Config } = require('./config')

/**
 * Build files using configuration parameters.
 * @param {object} options - Write options.
 * @param {string} options.dest - Where to write the file.
 * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @param {boolean} [options.force=false] Whether to replace an existing local file.
 * @param {boolean} [options.pretty] - Whether to indent JSON file contents.
 * @returns {void|Error}
 */
function Build(options) {
    this.config = new Config({
        values: options,
        keys: ['dest', 'src', 'sheet', 'select', 'where', 'force', 'pretty'],
        defaults: {
            pretty: true,
            force: false
        },
        depthMax: 3
    })
}

module.exports = { Build }
