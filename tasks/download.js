const { download } = require('../src/download')
const result = download({
    url: process.env.npm_config_url || process.env.npm_package_config_download_url,
    dest: process.env.npm_config_dest || process.env.npm_package_config_download_dest,
    force: process.env.npm_config_force || process.env.npm_package_config_download_force || false
})
if (result instanceof Error) {
    console.error(result)
}
