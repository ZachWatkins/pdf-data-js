export function createJsonFile(data, target) {
  if (fs.existsSync(target)) {
    fs.unlinkSync(target)
  }
  if (!fs.existsSync(path.dirname(target))) {
    fs.mkdirSync(path.dirname(target))
  }
  fs.writeFileSync(target, JSON.stringify(data, null, 4))
}

export default { createJsonFile }
