#!/usr/bin/env node
/**
 * Print a web page as a PDF file.
 * @author  Zachary K. Watkins
 * @created 2023-02-06 9:46PM CST
 * @package @zachwatkins/pdf-data-js
 */
const puppeteer = require('puppeteer')
const { platform } = require('os')
const WINDOWS_PLATFORM = 'win32'
const MAC_PLATFORM = 'darwin'
const osPlatform = platform()
const path = require('path')
const package = require('../package.json')
const url = process.env.npm_config_url || process.env.npm_package_config_url
const dest = path.resolve(`${__dirname}/../` + (process.env.npm_package_config_pdf_dest || './build/index.pdf'))

urlToPDF(url, { ...package.config.pdf.options, path: dest })

/**
 * Create a PDF file from a URL.
 * @param {string} url Web page to print.
 * @param {import('puppeteer').PDFOptions} options Puppeteer options for page.pdf()
 * @returns {Buffer} PDF file buffer.
 */
async function urlToPDF(url, options) {
    if (osPlatform === MAC_PLATFORM && 0 > url.indexOf('http://')) {
      url = 'file://' + url
    }
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(path.resolve(url), {waitUntil: 'networkidle0'})
    await page.setViewport({width: 1080, height: 1024})
    if (options.path) {
        options.path = path.resolve(options.path)
    }
    const pdf = await page.pdf(options)
    await browser.close()
    if (!options.path) {
        return pdf
    }
}
