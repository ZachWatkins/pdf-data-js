/**
 * Create a configuration object.
 * @param {object} options - Config options.
 * @param {object} options.values - Configuration values assigned upon creation.
 * @param {object} [options.defaults] - Default values.
 * @param {string[]} [options.allowed=[]] - List of allowed option keys.
 * @param {number} [options.depth=0] - How deep nested configurations may be found.
 * @param {number} [options.currentDepth=0] - How deep nested configurations are currently in the processing order.
 */
function Config({ values, defaults, allowed, depth, currentDepth }){
    this._options = { values, defaults, allowed, depth }
    defaults = defaults || {}
    allowed = allowed || []
    depth = depth || 0
    currentDepth = currentDepth || 0
    if (!allowed.length) {

    } else {
        allowed.forEach(key => {
            if (values.hasOwnProperty(key)) {
                this[key] = values[key]
            }
            if (defaults.hasOwnProperty(key)) {
                this[key] = defaults[key]
            }
        })
        if (depth && currentDepth < depth) {
            this.configs = Object.keys(values)
                .filter(key => 0 > allowed.indexOf(key))
                .reduce((configs, name) => {
                    configs[name] = new Config({
                        values: values[name],
                        defaults,
                        allowed,
                        depth,
                        currentDepth: currentDepth + 1
                    })
                }, {})
            }
        }
    }
}

module.exports = { NestedOptions }
