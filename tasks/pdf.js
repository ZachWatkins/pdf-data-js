#!/usr/bin/env node
/**
 * Print a web page as a PDF file.
 * @author  Zachary K. Watkins
 * @created 2023-02-06 9:46PM CST
 * @package @zachwatkins/pdf-data-js
 * @see     https://pptr.dev/api/puppeteer.page.pdf
 * @see     https://pptr.dev/api/puppeteer.pdfoptions
 */
/**
 * External dependencies.
 */
import puppeteer from 'puppeteer'
import { platform } from 'os'
import fs from 'fs'
import path from 'path'

const WINDOWS_PLATFORM = 'win32'
const MAC_PLATFORM = 'darwin'
const osPlatform = platform()

const url = process.env.npm_config_url || process.env.npm_package_config_url

urlToPDF({
  url,
  PDFOptions: {
    path: process.env.npm_package_config_pdf_options_path,
    displayHeaderFooter: Boolean(process.env.npm_package_config_pdf_options_displayHeaderFooter || false),
    format: process.env.npm_package_config_pdf_options_format || 'Letter',
    printBackground: Boolean(process.env.npm_package_config_pdf_options_printBackground || true),
  },
})

/**
 * Create a PDF file from a URL.
 * @param {object} options
 * @param {string} options.url - Web page to print.
 * @param {import('puppeteer').PDFOptions} options.PDFOptions - Puppeteer options for page.pdf()
 * @param {boolean} options.dest - Destination path for the PDF file.
 * @returns {void|Buffer} PDF file buffer.
 */
async function urlToPDF({ url, PDFOptions, dest }) {
    if (0 > url.indexOf('http://')) {
      url = osPlatform === MAC_PLATFORM ? 'file://' + process.cwd() + path.sep + url : process.cwd() + path.sep + url
    }
    if (PDFOptions.path) {
      PDFOptions.path = path.resolve(PDFOptions.path)
    }
    console.log(PDFOptions)
    const browser = await puppeteer.launch({ headless: "new" })
    const page = await browser.newPage()
    await page.addStyleTag({ content: 'body{-webkit-print-color-adjust:exact}' })
    await page.emulateMediaType('screen')
    await page.goto(path.resolve(url), {waitUntil: 'networkidle0'})
    await page.setViewport({width: 1080, height: 1024})
    const pdf = await page.pdf(PDFOptions)
    await browser.close()
    console.log(pdf)
    if (!dest) {
        return pdf
    }
}
