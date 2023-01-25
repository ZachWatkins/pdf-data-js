/**
 * Configuration management.
 * @author  Zachary K. Watkins
 * @created 2023-01-24 9:47PM CST
 * @package @zachwatkins/pdf-data-viz-js
 */

/**
 * @param {object} options - Config options.
 * @param {object} options.values - Configuration values assigned upon creation.
 * @param {object} [options.defaults] - Default values.
 * @param {string[]} [options.keys=[]] - List of keys option keys.
 * @param {number} [options.depth=0] - Depth of the current configuration.
 * @param {number} [options.depthMax=0] - Maximum configuration recursion depth.
 */
function Config({ values, defaults, keys, depth, depthMax }){
    defaults = defaults || {}
    values = ! values ? defaults : { ...defaults, ...values }
    keys = keys || []
    depth = depth || 0
    depthMax = depthMax || 0
    if (!keys.length) {
        Object.assign(this, values)
    } else {
        keys.forEach(key => {
            this[key] = values[key]
        })
        if (depthMax <= depth) {
            return;
        }
        const nested = Object.keys(values).filter(key => 0 > keys.indexOf(key))
        if (nested.length) {
            this.forEach(key => {
                this[key] = new Config({
                    values: values[key],
                    defaults: defaults,
                    keys: keys,
                    depth: depth + 1,
                    depthMax: depthMax
                })
            })
        }
    }
}

Config.prototype = {
    handle: function(callback){
        callback(this)
    }
}

module.exports = { Config }
