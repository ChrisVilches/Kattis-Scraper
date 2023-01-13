import { load } from 'cheerio'
import { parseRange, getDifficultyString, parseTimeLimit, heuristicCleanStatement } from './problemUtil'

export class Problem {
  statement: string = ''
  subdomain: string = ''
  slug: string = ''
  minDifficulty: number = 0
  maxDifficulty: number = 0
  timeLimit: number = 0

  static fromHtml (subdomain: string, slug: string, html: string): Problem {
    const $ = load(html)
    const fullText: string = $.text()

    const problem = new Problem()

    const difficultyString: string = getDifficultyString(fullText)
    const difficultyRange = parseRange(difficultyString)

    problem.statement = heuristicCleanStatement($('#instructions-container'))
    problem.subdomain = subdomain
    problem.slug = slug
    problem.timeLimit = parseTimeLimit(fullText)
    problem.minDifficulty = difficultyRange.min
    problem.maxDifficulty = difficultyRange.max

    return problem
  }
}
