const urlToPDF = require('../src/url-to-pdf')
const package = require('../package.json')
urlToPDF(
    package.config.pdf.url,
    { ...package.config.pdf.options, path: package.config.pdf.dest }
)
