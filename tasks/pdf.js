const package = require('../package.json')
const url = process.env.npm_config_url || process.env.npm_package_config_url
const path = process.env.npm_config_dest || process.env.npm_package_config_pdf_dest
require('../src/pdf')(url, { ...package.config.pdf.options, path })
