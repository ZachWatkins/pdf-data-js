/**
 * Save a web page as an image.
 * @author  Zachary K. Watkins
 * @created 2023-02-06 9:46PM CST
 * @package @zachwatkins/pdf-data-js
 * @see https://pptr.dev/api/puppeteer.page.screenshot
 */
const puppeteer = require('puppeteer')
const path = require('path')
const fs = require('fs')
const url =
  'file://' +
  path.resolve(
    `${__dirname}/../` +
      (process.env.npm_config_url || process.env.npm_package_config_url)
  )
const dest = path.resolve(
  `${__dirname}/../${
    process.env.npm_config_dest || process.env.npm_package_config_build_dest
  }`
)
if (!fs.existsSync(dest)) {
  fs.mkdirSync(dest)
}

screenshot({ url, dest, ScreenshotOptions: { path: `${dest}/index.png` } })

async function screenshot({ url, dest, selectors, ScreenshotOptions }) {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  if (url) {
    await page.goto(url)
    await page.screenshot(ScreenshotOptions)
  }
  if (selectors) {
    if (!Array.isArray(selectors)) {
      selectors = [selectors]
    }
    for (let i = 0; i < selectors.length; i++) {
      const selector = selectors[i]
      await page.waitForSelector(selector)
      const element = await page.$(selector)
      await element.screenshot({
        path: dest + `/element_${i + 1}.png`,
      })
    }
  }
  await browser.close()
}
