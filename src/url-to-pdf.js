const puppeteer = require('puppeteer')
const path = require('path')

/**
 * Create a PDF file from a URL.
 * @param {string} url Web page to print.
 * @param {import('puppeteer').PDFOptions} options Puppeteer options for page.pdf()
 * @returns {Buffer} PDF file buffer.
 */
async function urlToPDF(url, options) {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(path.resolve(url), {waitUntil: 'networkidle0'})
    if (options.path) {
        options.path = path.resolve(options.path)
    }
    const pdf = await page.pdf(options)
    await browser.close()
    if (!options.path) {
        return pdf
    }
}

module.exports = urlToPDF