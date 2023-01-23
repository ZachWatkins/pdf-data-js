const url = process.env.npm_config_url || process.env.npm_package_config_download_url
const dest = process.env.npm_config_dest || process.env.npm_package_config_download_dest
const force = process.env.npm_config_force || process.env.npm_package_config_download_force || false
const result = require('../src/download')({ url, dest, force })
if (true !== result) {
    result.forEach(error => console.error(error))
}
