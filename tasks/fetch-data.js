const download = require('../src/download')
const package = require('../package.json')
const options = {
    url: package.config.data.remote.url,
    dest: package.config.data.remote.dest,
    force: false
}
download(options)
