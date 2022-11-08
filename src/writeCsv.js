import { stringify } from 'csv-stringify'
import fs from 'fs'

export const writeCsv = rows => {
  stringify(rows, {
    header: true,
    columns: {
      problemStatement: 'problemStatement',
      subdomain: 'subdomain',
      slug: 'slug',
      minDifficulty: 'minDifficulty',
      maxDifficulty: 'maxDifficulty',
      timeLimit: 'timeLimit'
    }
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
