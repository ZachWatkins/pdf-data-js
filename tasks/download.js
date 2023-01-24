#!/usr/bin/env node
const options = {
    url: process.env.npm_config_url || process.env.npm_package_config_download_url,
    dest: process.env.npm_config_dest || process.env.npm_package_config_download_dest,
    force: process.env.npm_config_force || process.env.npm_package_config_download_force
}
const errors = require('../src/download').download(options)
if (errors) {
    errors.forEach(error => console.error(error))
}
