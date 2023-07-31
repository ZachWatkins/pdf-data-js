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
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import { createServer } from 'vite'

const serveDirectory = fileURLToPath(new URL('../build', import.meta.url))
let closeServer = () => process.exit(0)
;(async () => {
  const server = await createServer({
    configFile: false,
    root: serveDirectory,
    server: {
      port: 1337,
    },
  })
  await server.listen()
  closeServer = () => server.close() && process.exit(0)
})()

urlToPDF({
  url: 'http://localhost:1337',
  PDFOptions: {
    path: process.env.npm_package_config_pdf_options_path,
    displayHeaderFooter: Boolean(
      process.env.npm_package_config_pdf_options_displayHeaderFooter || false
    ),
    format: process.env.npm_package_config_pdf_options_format || 'Letter',
    printBackground: Boolean(
      process.env.npm_package_config_pdf_options_printBackground || true
    ),
  },
  callback: closeServer,
})

/**
 * Create a PDF file from a URL.
 * @param {object} options
 * @param {string} options.url - Fully qualified URL of a file or web page to print.
 * @param {import('puppeteer').PDFOptions} options.PDFOptions - Puppeteer options for page.pdf()
 * @param {function} options.callback - Callback function to execute after PDF is created.
 * @returns {void|Buffer} PDF file buffer.
 */
async function urlToPDF({ url, PDFOptions, callback }) {
  if (PDFOptions.path) {
    if (!fs.existsSync(path.dirname(PDFOptions.path))) {
      fs.mkdirSync(path.dirname(PDFOptions.path))
    }
  }

  const browser = await puppeteer.launch({ headless: 'new' })
  const page = await browser.newPage()

  await page.addStyleTag({ content: 'body{-webkit-print-color-adjust:exact}' })
  await page.emulateMediaType('screen')
  await page.goto(url, { waitUntil: 'networkidle0' })
  await page.setViewport({ width: 1080, height: 1024 })

  const pdf = await page.pdf(PDFOptions)

  await browser.close()

  callback()
}
