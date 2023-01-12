import { scrapeProblem } from './scrapeProblem'
import { getHtml } from './getHtml'
import { writeCsv } from './writeCsv'
import { populateSurrealDb } from './populateSurrealDb'
import { Problem } from './Problem'
import { problemDebugPreview } from './problemUtil'

const PROBLEM_LINK_REGEX = /"\/problems\/([a-zA-Z0-9-_]+)"/g

const getAllProblemSlugs = (html: string): string[] => {
  const allSlugs = (html.match(PROBLEM_LINK_REGEX) ?? []).map((s: string) => s.replace(PROBLEM_LINK_REGEX, '$1'))
  return [...new Set(allSlugs)]
}

const getAllSlugsInPage = async (subdomain: string, page: number): Promise<string[]> => {
  const listPageUrl = `https://${subdomain}.kattis.com/problems?page=${page}&order=-difficulty_category`
  console.log(`Page: ${listPageUrl}`)
  const html = await getHtml(listPageUrl)
  return getAllProblemSlugs(html)
}

const collectData = async (subdomain: string): Promise<Problem[]> => {
  const allProblems: Problem[] = []

  for (let i = 0; ; i++) {
    const slugs = await getAllSlugsInPage(subdomain, i)

    if (slugs.length === 0) break

    for (const slug of slugs) {
      const problem: Problem = await scrapeProblem(subdomain, slug)
      console.log(allProblems.length, problemDebugPreview(problem))
      allProblems.push(problem)
    }
  }

  return allProblems
}

const ALLOWED_OUTPUT_TYPES = ['csv', 'surrealdb']

const main = async (): Promise<void> => {
  const outputType = String(process.argv[2])

  if (!ALLOWED_OUTPUT_TYPES.includes(outputType)) {
    throw new Error(`Output type "${outputType}" is not allowed (must be ${ALLOWED_OUTPUT_TYPES.join(', ')})`)
  }

  const icpc: Problem[] = await collectData('icpc')
  const open: Problem[] = await collectData('open')

  const allProblems: Problem[] = [...icpc, ...open]

  console.log(`${allProblems.length} problems were obtained`)

  switch (outputType) {
    case 'csv':
      writeCsv(allProblems)
      break
    case 'surrealdb':
      await populateSurrealDb(allProblems)
      break
  }
}

main().catch(console.error)
