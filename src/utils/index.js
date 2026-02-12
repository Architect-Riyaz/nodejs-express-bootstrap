import fs from "fs"

export const delay = (delayInms) => {
  return new Promise((resolve) => setTimeout(resolve, delayInms))
}

export const readJsonFile = async (fileName) => {
  const data = await fs.promises.readFile(fileName, "utf8")
  return JSON.parse(data)
}
