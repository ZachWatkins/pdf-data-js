const puppeteer = require('puppeteer')
const fs = require('fs')
const pdfOptions = {
    path: __dirname + '/index.pdf',
    format: 'Letter',
    printBackground: true,
    displayHeaderFooter: false
}

async function printPDF() {
    const browser = await puppeteer.launch({ headless: true })
    const page = await browser.newPage()
    await page.goto(__dirname + '/index.html', {waitUntil: 'networkidle0'})
    const pdf = await page.pdf(pdfOptions)

    await browser.close()
    return pdf
}
printPDF()