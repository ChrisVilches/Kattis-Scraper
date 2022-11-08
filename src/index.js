import { scrapeProblem } from './scrapeProblem.js'
import { getHtml } from './getHtml.js'
import { writeCsv } from './writeCsv.js'
import { populateSurrealDb } from './populateSurrealDb.js'

const PROBLEM_LINK_REGEX = /"\/problems\/([a-zA-Z0-9-_]+)"/g

const getAllProblemSlugs = html => {
  const allSlugs = (html.match(PROBLEM_LINK_REGEX) || []).map(s => s.replace(PROBLEM_LINK_REGEX, '$1'))
  return [...new Set(allSlugs)]
}

const getAllSlugsInPage = async (subdomain, page) => {
  const listPageUrl = `https://${subdomain}.kattis.com/problems?page=${page}&order=-difficulty_category`
  console.log(listPageUrl)
  const html = await getHtml(listPageUrl)
  return getAllProblemSlugs(html)
}

const collectData = async subdomain => {
  const allRows = []

  for (let i = 0; ; i++) {
    const slugs = await getAllSlugsInPage(subdomain, i)

    if (slugs.length === 0) break

    for (const slug of slugs) {
      const { minDifficulty, maxDifficulty, timeLimit, statement } = await scrapeProblem(subdomain, slug)

      allRows.push({
        statement,
        subdomain,
        slug,
        minDifficulty,
        maxDifficulty,
        timeLimit
      })
    }
  }

  return allRows
}

const ALLOWED_OUTPUT_TYPES = ['csv', 'surrealdb']

const main = async () => {
  const outputType = String(process.argv[2])

  if (!ALLOWED_OUTPUT_TYPES.includes(outputType)) {
    throw new Error(`Output type "${outputType}" is not allowed (must be ${ALLOWED_OUTPUT_TYPES.join(', ')})`)
  }

  const icpc = await collectData('icpc')
  const open = await collectData('open')

  const allRows = [...icpc, ...open]

  console.log(`${allRows.length} problems were obtained`)

  switch (outputType) {
    case 'csv':
      writeCsv(allRows)
      break
    case 'surrealdb':
      await populateSurrealDb(allRows)
      break
  }
}

main()
