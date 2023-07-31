/**
 * Configuration management.
 * @author  Zachary K. Watkins
 * @created 2023-01-24 9:47PM CST
 * @package @zachwatkins/pdf-data-viz-js
 */

/**
 * Combines Config options into how the Config class uses them internally.
 * @param {object} options - Config options.
 * @param {object} [options.defaults] - Default values.
 * @param {object} options.values - Configuration values assigned upon creation.
 * @param {string[]} [options.keys=[]] - List of allowed option keys.
 * @param {number} [options.depth=0] - Depth of the current configuration.
 * @param {number} [options.depthMax=0] - Maximum configuration recursion depth.
 * @param {function} [options.callback] - Function to call on this and child Config objects.
 * @prop {object} defaults - Default values.
 * @prop {object} values - Configuration values assigned upon creation.
 * @prop {string[]} keys - List of allowed option keys.
 * @prop {number} depth - Depth of the current configuration.
 * @prop {number} depthMax - Maximum depth of nested configurations.
 * @prop {function|null} callback - Function to call on this and child Config objects.
 */
class ConfigOptions {
  constructor(options) {
    this.defaults = options.defaults || {}
    this.values = !options.values
      ? options.defaults
      : { ...options.defaults, ...options.values }
    this.keys = options.keys || Object.keys(this.values)
    this.depth = options.depth || 0
    this.depthMax = options.depthMax || 0
    this.callback = options.callback || null
  }
}

function ownConfigKeys({ keys, values }) {
  return keys.filter((key) => values.hasOwnProperty(key))
}

function childConfigKeys({ values, keys }) {
  return Object.keys(values).filter((key) => -1 === keys.indexOf(key))
}

/**
 * Nested configuration object which assigns parent values as default values for child
 * configurations and simplifies recursively applying a callback to all configurations in
 * the tree.
 * @param {object} options - Config options.
 * @param {object} [options.defaults] - Default values.
 * @param {object} options.values - Configuration values assigned upon creation.
 * @param {string[]} [options.keys=[]] - List of allowed option keys.
 * @param {number} [options.depth=0] - Depth of the current configuration.
 * @param {number} [options.depthMax=0] - Maximum configuration recursion depth.
 * @param {function} [options.callback] - Function to call on this and child Config objects.
 */
class Config {
  _childConfigKeys = []
  constructor(options) {
    let { defaults, values, keys, depth, depthMax, callback } =
      new ConfigOptions(options)
    const ownKeys = ownConfigKeys({ keys, values })
    const childKeys = childConfigKeys({ keys, values })
    if (childKeys.length) {
      this._childConfigKeys = childKeys
    }
    ownKeys.forEach((key) => (this[key] = values[key]))
    if (callback) {
      callback(this)
    }
    if (depth < depthMax) {
      depth += 1
      ownKeys.forEach((key) => (defaults[key] = values[key]))
      childKeys.forEach((key) => {
        const opts = {
          values: values[key],
          defaults,
          keys,
          depth,
          depthMax,
          callback,
        }
        this[key] = new Config(opts)
      })
    }
  }

  each(callback) {
    callback(this)
    if (this._childConfigKeys) {
      this._childConfigKeys.forEach((key) => this[key].each(callback))
    }
  }
}

module.exports = { Config }
