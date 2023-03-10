#!/usr/bin/env node
/**
 * Print a web page as a PDF file.
 * @author  Zachary K. Watkins
 * @created 2023-02-06 9:46PM CST
 * @package @zachwatkins/pdf-data-js
 * @see     https://pptr.dev/api/puppeteer.page.pdf
 * @see     https://pptr.dev/api/puppeteer.pdfoptions
 */
const puppeteer = require('puppeteer')
const { platform } = require('os')
const fs = require('fs')
const path = require('path')
const WINDOWS_PLATFORM = 'win32'
const MAC_PLATFORM = 'darwin'
const osPlatform = platform()
const url = process.env.npm_config_url || process.env.npm_package_config_url
const builddir = path.resolve(`${__dirname}/../`) + process.env.npm_config_dest || process.env.npm_package_config_build_dir
if (!fs.existsSync(builddir)) {
    fs.mkdirSync(builddir)
}
const PDFOptions = {
  ...process.env.npm_package_config_pdf_options,
  dest: path.resolve(`${__dirname}/../${process.env.npm_package_config_pdf_dest}`)
}

urlToPDF({ url, PDFOptions })

/**
 * Create a PDF file from a URL.
 * @param {object} options
 * @param {string} options.url Web page to print.
 * @param {import('puppeteer').PDFOptions} options.PDFOptions Puppeteer options for page.pdf()
 * @returns {void|Buffer} PDF file buffer.
 */
async function urlToPDF({ url, PDFOptions, dest }) {
    if (osPlatform === MAC_PLATFORM && 0 > url.indexOf('http://')) {
      url = 'file://' + url
    }
    if (PDFOptions.path) {
      PDFOptions.path = path.resolve(PDFOptions.path)
    }
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.addStyleTag({ content: 'body{-webk it-print-color-adjust:exact}' })
    await page.emulateMediaType('screen')
    await page.goto(path.resolve(url), {waitUntil: 'networkidle0'})
    await page.setViewport({width: 1080, height: 1024})
    const pdf = await page.pdf(PDFOptions)
    await browser.close()
    if (!dest) {
        return pdf
    }
}
