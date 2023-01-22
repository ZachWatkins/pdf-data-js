const result = require('../src/open')(process.env.npm_config_url || process.env.npm_package_config_url)
if (result instanceof Error) {
    console.error(result)
}
