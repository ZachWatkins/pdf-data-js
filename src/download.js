const https = require('https')
const fs = require('fs')
const path = require('path')

/**
 * Download a remote file.
 * @param {object} options
 * @param {string} url Remote URL for file to download.
 * @param {string} dest Local destination file path.
 * @param {boolean} force Whether to replace an existing local file.
 * @return {void}
 */
function download({url, dest, force}) {
    force = force || false
    dest = path.resolve(dest)
    if (fs.existsSync(dest) && !force) {
        console.error(`File exists: ${path.basename(dest)}`)
        return;
    }

    const req = https.get(url, function (res) {
        const fileStream = fs.createWriteStream(dest)

        res.pipe(fileStream)

        fileStream.on('error', function (err) {
            console.error(err)
        });

        fileStream.on('close', function () {
            console.log('close')
        });

        fileStream.on('finish', function () {
            fileStream.close()
        })
    })

    req.on('error', function (err) {
        console.error(err)
    });
}

module.exports = download
