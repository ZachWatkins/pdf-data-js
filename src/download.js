const https = require('https')
const fs = require('fs')
const path = require('path')

/**
 * Download a remote file.
 * @param {object} options
 * @param {string} options.url Remote URL for file to download.
 * @param {string} options.dest Local destination file path.
 * @param {boolean} options.force Whether to replace an existing local file.
 * @returns {true|Error}
 */
function download({url, dest, force}) {
    force = force || true
    const errors = []
    if (!url) errors.push(new Error('URL not provided.'))
    if (!dest) errors.push(new Error('Destination file path not provided.'))
    if (!force && fs.existsSync(dest)) errors.push(new Error(`File exists: ${path.basename(dest)}`))
    if (errors.length) return errors

    const req = https.get(url, res => {
        const fileStream = fs.createWriteStream(dest)

        res.pipe(fileStream)

        fileStream.on('error', err => {
            errors.push(err)
        })

        fileStream.on('finish', () => {
            fileStream.close()
        })
    })

    req.on('error', err => {
        errors.push(err)
    })

    return errors.length ? errors : true
}

module.exports = { download }
