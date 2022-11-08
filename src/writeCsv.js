import { stringify } from 'csv-stringify'
import fs from 'fs'

export const writeCsv = rows => {
  const columns = Object.keys(rows[0]).reduce((accum, elem) => ({ ...accum, [elem]: elem }), {})

  stringify(rows, {
    header: true,
    columns
  }, (error, text) => {
    if (error) {
      throw error
    }

    const filePath = './dump/result.csv'

    fs.writeFile(filePath, text, err => {
      if (err) {
        throw err
      }

      console.log(`Created file ${filePath}`)
    })
  })
}
