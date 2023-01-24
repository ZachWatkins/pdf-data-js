const https = require('https')
const fs = require('fs')
const path = require('path')

/**
 * Download a remote file.
 * @param {object} options
 * @param {string} options.url Remote URL for file to download.
 * @param {string} options.dest Local destination file path.
 * @param {boolean} [options.force=false] Whether to replace an existing local file.
 * @returns {void|Error[]}
 */
function download({url, dest, force}) {
    const errors = []
    if (!url) errors.push(new Error('URL not provided.'))
    if (!dest) errors.push(new Error('Destination file path not provided.'))
    if (typeof force === "undefined" && fs.existsSync(dest)) {
        errors.push(new Error(`File exists: ${path.basename(dest)}. Use --force to override.`))
    }
    if (errors.length) return errors

    const filename = path.basename(dest)
    const temp = dest.replace(filename, `.temp.${filename}`)
    const req = https.get(url, res => {
        const fileStream = fs.createWriteStream(temp)
        res.pipe(fileStream)
        fileStream.on('error', err => {
            console.error(err)
        })
        fileStream.on('finish', () => {
            fileStream.close()
            if (fs.existsSync(temp)) {
                if (0 === errors.length) {
                    if (fs.existsSync(dest)) {
                        fs.unlinkSync(dest)
                    }
                    fs.rename(temp, dest, () => {})
                } else {
                    fs.unlinkSync(temp)
                }
            }
        })
    })
    req.on('error', err => {
        console.error(err)
    })
}

module.exports = { download }
