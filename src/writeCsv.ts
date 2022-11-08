import { stringify } from 'csv-stringify'
import fs from 'fs'
import { Problem } from './Problem'

export const writeCsv = (problems: Problem[]): void => {
  const columns = Object.keys(problems[0]).reduce((accum, elem) => ({ ...accum, [elem]: elem }), {})

  stringify(problems, {
    header: true,
    columns
  }, (error, text) => {
    if (error != null) {
      throw error
    }

    const filePath = './dump/result.csv'

    fs.writeFile(filePath, text, err => {
      if (err != null) {
        throw err
      }

      console.log(`Created file ${filePath}`)
    })
  })
}
