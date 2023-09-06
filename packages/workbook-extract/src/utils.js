/**
 * Utility functions for the project.
 * @author Zachary K. Watkins, <zwatkins.it@gmail.com>
 * @year 2023
 */
import XLSX from 'xlsx'
import fs from 'fs'
import path from 'path'

export function log(v, ...message) {
  if (v) {
    console.log(...message)
  }
}

/**
 * Create a workbook file.
 * @param {array} data
 * @param {string} target - Target file path to write.
 * @return {void}
 */
export function createWorkbookFile(data, target, tabName) {
  if (fs.existsSync(target)) {
    fs.unlinkSync(target)
  }
  if (!fs.existsSync(path.dirname(target))) {
    fs.mkdirSync(path.dirname(target))
  }
  const workbook = XLSX.utils.book_new()
  const worksheet = XLSX.utils.json_to_sheet(data)
  XLSX.utils.book_append_sheet(workbook, worksheet, tabName)
  XLSX.writeFileXLSX(workbook, target)
}

/**
 * Create a JSON file.
 * @param {object|array} data
 * @param {string} target - Target file path to write.
 * @return {void}
 */
export function createJsonFile(data, target) {
  if (fs.existsSync(target)) {
    fs.unlinkSync(target)
  }
  if (!fs.existsSync(path.dirname(target))) {
    fs.mkdirSync(path.dirname(target))
  }
  fs.writeFileSync(target, JSON.stringify(data, null, 4))
}

export function createFile({ data, target, sheet }) {
  const fileType = path.extname(target)
  if ('.json' === fileType) {
    return createJsonFile(data, target)
  }
  if ('.xlsx' === fileType) {
    return createWorkbookFile(data, target, sheet)
  }
  throw new Error(`Invalid file type: ${fileType}, received: ${target}`)
}

/**
 * Whether or not to create an extract item's file.
 * @param {object} extractItem - Extract item from config.
 * @param {boolean} override - Whether or not to override existing files.
 * @return {boolean} - Whether or not to create the file.
 */
export function shouldCreateFile(extractItem, override) {
  if (!fs.existsSync(extractItem.target)) {
    return true
  }
  return override ? true : false
}

export default { createFile, log, shouldCreateFile }
