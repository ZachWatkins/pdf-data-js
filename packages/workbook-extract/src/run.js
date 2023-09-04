/**
 * JavaScript module to extract data from a workbook sheet and save it to a JSON file.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

const queryFilter = {
  '=': function (row, key, value) {
    return row[key] === value
  },
  '>': function (row, key, value) {
    return row[key] > value
  },
  '>=': function (row, key, value) {
    return row[key] >= value
  },
  '<': function (row, key, value) {
    return row[key] < value
  },
  '<=': function (row, key, value) {
    return row[key] <= value
  },
}

export default function run({ workbook, config, verbose }) {
  if (config && config.extract) {
    for (let i = 0; i < config.extract.length; i++) {
      const extract = config.extract[i]
      if (verbose) {
        console.log(
          `Extracting workbook sheet named "${extract.sheet}" and saving it to "${extract.target}"`
        )
      }
      const wb = XLSX.readFile(workbook)
      if (verbose) {
        console.log('Workbook loaded, converting sheet to JSON...')
      }
      const sheet = wb.Sheets[extract.sheet]
      const filter = extract?.query?.where || false
      const data = !filter
        ? XLSX.utils.sheet_to_json(sheet)
        : XLSX.utils.sheet_to_json(sheet).filter((row) => {
            let match = true
            for (let i = 0; i < filter.length; i++) {
              const f = filter[i]
              const key = f[0]
              const value = f[2]
              if (!queryFilter[f[1]](row, key, value)) {
                match = false
                break
              }
            }
            return match
          })
      if (verbose) {
        console.log('Sheet converted to JSON, writing to file...')
      }
      const json = JSON.stringify(data)
      if (fs.existsSync(extract.target)) {
        fs.unlinkSync(extract.target)
      }
      if (!fs.existsSync(path.dirname(extract.target))) {
        fs.mkdirSync(path.dirname(extract.target))
      }
      fs.writeFileSync(extract.target, json)
      if (verbose) {
        console.log(`JSON written to file: ${extract.target}`)
      }
    }
  }
}
