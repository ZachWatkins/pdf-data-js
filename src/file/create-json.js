const fs = require('fs')
const path = require('path')

function CreateJsonFile({dest, data, pretty}) {
    pretty = pretty || false
    const json = !pretty
        ? JSON.stringify(data)
        : JSON.stringify(data, null, 4)
    fs.writeFile(dest, json, {encoding: 'utf8'}, () => {
        console.log(`Created: ${path.basename(dest)}`)
    })
}

module.exports = CreateJsonFile
