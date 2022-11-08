import { scrapeProblem } from './scrapeProblem.js'
import { getHtml } from './getHtml.js'
import { writeCsv } from './writeCsv.js'
import { populateSurrealDb } from './populateSurrealDb.js'

const PROBLEM_LINK_REGEX = /"\/problems\/([a-zA-Z0-9-_]+)"/g

const getAllProblemSlugs = html => {
  const allSlugs = (html.match(PROBLEM_LINK_REGEX) || []).map(s => s.replace(PROBLEM_LINK_REGEX, '$1'))
  return [...new Set(allSlugs)]
}

// TODO: I think it'd be nice to add a mechanism to detect that the page was loaded correctly,
//       and I didn't get a message error like "not allowed because it's scraping". So add a check.

const getAllSlugsInPage = async (subdomain, page) => {
  const listPageUrl = `https://${subdomain}.kattis.com/problems?page=${page}&order=-difficulty_category`
  console.log(listPageUrl)
  const html = await getHtml(listPageUrl)
  const allSlugs = getAllProblemSlugs(html)

  return allSlugs
}

const collectData = async (subdomain, maxPage) => {
  const allRows = []

  for (let i = 0; i <= maxPage; i++) {
    const slugs = await getAllSlugsInPage(subdomain, i)

    if (slugs.length === 0) continue

    for (const slug of slugs) {
      const { minDifficulty, maxDifficulty, timeLimit, problemStatement } = await scrapeProblem(subdomain, slug)

      allRows.push({
        problemStatement,
        subdomain,
        slug,
        minDifficulty,
        maxDifficulty,
        timeLimit
      })
      // await sleep(500)
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

  // TODO: The maxPage parameter should be empty, and the collecting should stop when there's an empty page.
  const icpc = await collectData('icpc', 3)
  const open = await collectData('open', 37)

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
