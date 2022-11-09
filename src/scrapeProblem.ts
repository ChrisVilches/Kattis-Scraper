import { getHtml } from './getHtml'
import { Problem } from './Problem'

export const scrapeProblem = async (subdomain: string, slug: string): Promise<Problem> => {
  const pageHtml = await getHtml(`https://${subdomain}.kattis.com/problems/${slug}`)

  try {
    return Problem.fromHtml(subdomain, slug, pageHtml)
  } catch (e) {
    console.error(`Error found in problem "${slug}"`)
    throw e
  }
}
