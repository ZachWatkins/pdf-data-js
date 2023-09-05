/**
 * JavaScript module to extract data from a workbook sheet and save it to a JSON file.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */

import fs from 'fs'
import path from 'path'
import XLSX from 'xlsx'

function log(verbose, ...message) {
  if (verbose) {
    console.log(...message)
  }
}

const queryWhere = {
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

function makeWhereQuery(clauses) {
  return function (row) {
    let match = true
    for (let i = 0; i < clauses.length; i++) {
      const clause = clauses[i]
      if (!queryWhere[clause[1]](row, clause[0], clause[2])) {
        match = false
        break
      }
    }
    return match
  }
}

function getSourceColumnName(column) {
  return column.indexOf(' ') > -1 ? column.split(' ')[0] : column
}

function getTargetColumnName(column) {
  return column.indexOf(' ') > -1 ? column.split(' ').pop() : column
}

function makeSelectQuery(columns) {
  if (!columns.length) {
    throw new Error('No columns specified.')
  }
  const hasRenamedColumns = columns.some(
    (column) => column.toLowerCase().indexOf(' as ') > -1
  )
  if (!hasRenamedColumns) {
    return function (row) {
      const result = {}
      for (let i = 0; i < columns.length; i++) {
        const column = columns[i]
        result[column] = row[column]
      }
      return result
    }
  }
  const sourceColumnNames = columns.map(getSourceColumnName)
  const targetColumnNames = columns.map(getTargetColumnName)
  return function (row) {
    const result = {}
    for (let i = 0; i < sourceColumnNames.length; i++) {
      result[targetColumnNames[i]] = row[sourceColumnNames[i]]
    }
    return result
  }
}

function getColumnType(column, rows) {
  for (let i = 0; i < rows.length; i++) {
    const row = rows[i]
    if ('undefined' !== typeof row[column] && null !== row[column]) {
      return typeof row[column]
    }
  }
  return typeof rows[0][column]
}

/**
 * Create a function which can be used to sort an array of objects by the given clause.
 * If the column value is a string, the sort will be case-insensitive.
 * @param {[string, "asc"|"desc"]} clause - An array of column names and sort directions.
 * @param {object[]} rows - An array of objects to be sorted.
 * @returns {function} - A function which can be used to sort an array of objects by the given clauses.
 */
function makeOrderByQuery(clause, rows) {
  const columnType = getColumnType(clause, rows)
  return function (rowA, rowB) {
    const columnName = clause[0]
    const valueA = rowA[columnName]
    const valueB = rowB[columnName]
    if (valueA === valueB) {
      return 0
    }
    let result = 0
    const valueAType = typeof valueA
    const valueBType = typeof valueB
    if ('string' === columnType) {
      if (valueAType === 'string' && valueBType === 'string') {
        result = valueA.localeCompare(valueB)
      } else if (valueAType === 'string') {
        result = valueA.localeCompare(valueB.toString())
      } else if (valueBType === 'string') {
        result = valueA.toString().localeCompare(valueB)
      } else {
        result = valueA.toString().localeCompare(valueB.toString())
      }
    } else if ('number' === columnType) {
      if (valueAType === 'number' && valueBType === 'number') {
        result = valueA - valueB
      } else if (valueAType === 'number') {
        result = valueA - parseFloat(valueB)
      } else if (valueBType === 'number') {
        result = parseFloat(valueA) - valueB
      } else {
        result = parseFloat(valueA) - parseFloat(valueB)
      }
    } else if ('boolean' === columnType) {
      if (valueAType === 'boolean' && valueBType === 'boolean') {
        result = valueA ? 1 : -1
      } else if (valueAType === 'boolean') {
        result = valueA ? 1 : -1
      } else if (valueBType === 'boolean') {
        result = valueA ? -1 : 1
      } else {
        result = valueA ? -1 : 1
      }
    }

    if ('desc' === clause[1]) {
      result *= -1
    }

    return result
  }
}

function createJsonFile(data, target) {
  if (fs.existsSync(target)) {
    fs.unlinkSync(target)
  }
  if (!fs.existsSync(path.dirname(target))) {
    fs.mkdirSync(path.dirname(target))
  }
  fs.writeFileSync(target, JSON.stringify(data, null, 4))
}

function runExtract(workbook, sheet, target) {
  log(verbose, 'Loading', path.basename(workbook))

  const wb = XLSX.readFile(workbook)

  log(verbose, 'Workbook loaded, converting sheet to JSON...')

  const data = XLSX.utils.sheet_to_json(wb.Sheets[sheet])

  log(verbose, 'Sheet converted to JSON, writing to file...')

  createJsonFile(data, target)
}

function runQueriedExtract(workbook, sheet, query, target) {
  log(verbose, 'Loading', path.basename(workbook))

  const wb = XLSX.readFile(workbook)

  log(verbose, 'Workbook loaded, converting sheet to JSON...')

  const data =
    query.where && query.where.length
      ? XLSX.utils.sheet_to_json(wb.Sheets[sheet]).filter(makeWhereQuery(query))
      : XLSX.utils.sheet_to_json(wb.Sheets[sheet])

  if (query.select) {
    const select = makeSelectQuery(query.select)
    for (let i = 0; i < data.length; i++) {
      data[i] = select(data[i])
    }
  }

  if (query.orderBy && query.orderBy.length) {
    for (let i = 0; i < query.orderBy.length; i++) {
      const clause = query.orderBy[i]
      if (clause.length !== 2) {
        clause.push('asc')
      }
      data.sort(makeOrderByQuery(query.orderBy, data))
    }
  }

  log(verbose, 'Sheet converted to JSON, writing to file...')

  createJsonFile(data, target)
}

export function run({ workbook, config, verbose }) {
  if (config && config.extract) {
    for (let i = 0; i < config.extract.length; i++) {
      if (!extract.query) {
        runExtract(workbook, extract.sheet, extract.target)
      } else {
        runQueriedExtract(
          workbook,
          extract.sheet,
          extract.query,
          extract.target
        )
      }

      log(verbose, `JSON written to file: ${extract.target}`)
    }
  }
}

export default {
  run,
}
