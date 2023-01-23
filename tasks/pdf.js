const package = require('../package.json')
require('../src/url-to-pdf')(
    process.env.npm_config_url || process.env.npm_package_config_url,
    {
        ...package.config.pdf.options,
        path: process.env.npm_config_dest || process.env.npm_package_config_pdf_dest || './index.pdf'
    }
)
