const puppeteer = require('puppeteer')
const path = require('path')
const url = 'file://' + path.resolve(`${__dirname}/../` + (process.env.npm_config_url || process.env.npm_package_config_url))
const dest = path.resolve(`${__dirname}/../` + (process.env.npm_package_config_pdf_dest || 'build/index.png'))
const screenshotOptions = {path: './build/index.png'}

screenshot(url, screenshotOptions)

async function screenshot(url, options) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.goto(url)
  await page.screenshot(options)
  await browser.close()
}
