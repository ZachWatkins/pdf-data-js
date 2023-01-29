const query = require('./query')
const read = require('./read')
const XLSX = require('xlsx')

// Goes in package.json, provider-facing.
const ExampleWorkbookConfig = {
    "name": "Example Workbook",
    "path": "texas.xlsx",
    "sheets": [{
        "name": "Under6",
        "select": [
            "State_Name",
            "County_Name",
            "StudyYear",
            "H_Under6_BothWork",
            "H_Under6_FWork",
            "H_Under6_MWork",
            "H_Under6_SingleM"
        ],
        "from": "./data/nationaldatabaseofchildcareprices.xlsx",
        "sheet": "in",
        "where": [
            ["State_Name", "Texas"]
        ],
        "orderBy": [
            ["County_Name", "ascending"],
            ["StudyYear", "descending"],
        ]
    }]
}

const ConfigSchema = {
    "$schema": "https://json-schema.org/draft/2020-12/schema",
    "$id": "https://zachwatkins.dev/schemas/workbookschema.json",
    "type": "object",
    "properties": {
        "name": {
            "type": "string"
        },
        "path": {
            "type": "string",
            "format": "uri"
        },
        "sheets": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "properties": {
                    "name": {
                        "type": "string"
                    },
                    "select": {
                        "type": "array",
                        "uniqueItems": true,
                        "items": {
                            "type": "string"
                        }
                    },
                    "from": {
                        "type": "string",
                        "format": "uri"
                    },
                    "sheet": {
                        "type": "string"
                    },
                    "where": {
                        "type": "array",
                        "uniqueItems": true,
                        "items": {
                            "type": "array",
                            "items": {
                                "type": "string",
                                "uniqueItems": true
                            }
                        }
                    },
                    "orderBy": {
                        "type": "array",
                        "uniqueItems": true,
                        "items": {
                            "type": ["string", "array"],
                            "uniqueItems": true,
                            "prefixItems": [
                                {
                                    "type": "string",
                                },
                                {
                                    "enum": ["ascending", "descending", "asc", "desc", "ASC", "DESC"],
                                }
                            ],
                            "items": false
                        }
                    }
                },
                "additionalProperties": false,
                "required": [
                    "name",
                    "select",
                    "from",
                    "sheet",
                    "where",
                    "orderBy"
                ]
            }
        }
    },
    "additionalProperties": true,
    "required": [
        "name",
        "path",
        "sheets"
    ]
}

class Sheet {
    constructor({}) {

    }
}

class SheetQuery {
    constructor({ source, workbook, sheet, select, where, orderBy }) {
        if (!sheet || typeof sheet === "string") {
            sheet = read.GetWorkSheet({ workbook, source, sheet: sheet || sheetName })
            sheet = workbook
                ? workbook.Sheets[sheetName]
        }
    }
}

class Workbook {
    file = {
        path: undefined,
        type: undefined,
        write: false // read, write
    }
    sheets: {}
    /**
     * A workbook object which can be constructed from a file path.
     * @param {object} options
     * @param {string} options.path - WorkBook file path.
     * @param {boolean} options.write - Whether to allow writing changes to the source file.
     */
    constructor({ path, write }) {
        if (path) {
            this.file = {
                path,
                type: src.match(/\.[^.]+$/)[0]
            }
            const workbook = XLSX.readFileSync(src)
            this.sheets = workbook.SheetNames
            for (let i = 0; i < this.sheets.length; i++) {
                const name = this.sheets[i];
                this[name] = XLSX.utils.sheet_to_json(workbook.Sheets[name])
            }
        }
    }

    /**
     * Retrieve a WorkBook object from a file path.
     * @param {string} source - WorkBook file path.
     * @returns {import('xlsx').WorkBook} WorkBook object.
    */
    static fromFile(source) {
        return XLSX.readFileSync(source)
    }
}

/**
 * Retrieve a WorkBook from a file path.
 * @param {string} src - WorkBook file path.
 * @returns {import('xlsx').WorkBook} WorkBook object.
 */
function GetWorkBook(src) {
    return XLSX.readFileSync(src)
}

/**
 * Select a Worksheet from a WorkBook.
 * @param {object} options - Read options.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.src] - WorkBook file path.
 * @returns {import('xlsx').WorkSheet} WorkSheet object.
 */
function GetWorkSheet({ sheet, src, workbook }) {
    console.log('GetWorkSheet')
    workbook = workbook || GetWorkBook(src)
    sheet = sheet || Object.keys(workbook.SheetNames)[0]
    return workbook.Sheets[sheet]
}

/**
 * Select Worksheet rows from a WorkBook.
 * @param {object} options - Read options.
 * @param {string} [options.sheet] - WorkBook sheet name. Defaults to the first WorkBook sheet name.
 * @param {import('xlsx').WorkBook} [options.workbook] - WorkBook object. Has priority over options.src.
 * @param {string} [options.src] - WorkBook file path. Required if options.workbook is not defined.
 * @param {string[]} [options.select] - Columns to select.
 * @param {object} [options.where] - Only select objects having these property values.
 * @returns {object[]} Rows.
 */
function GetWorkSheetRows({ sheet, src, workbook, select, where }) {
    const worksheet = GetWorkSheet({ sheet, src, workbook })
    let rows = XLSX.utils.sheet_to_json(worksheet)
    if (where) rows = query.where(where, rows)
    if (select) rows = query.select(select, rows)
    return rows
}

module.exports = { WorkBook, GetWorkBook, WorkBookSheets, GetWorkSheet, GetWorkSheetRows }
