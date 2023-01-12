import { load } from 'cheerio'
import { parseRange, getDifficultyString, parseTimeLimit, statementHasEssentialMetaData, heuristicCleanStatement } from './problemUtil'

export class Problem {
  statement: string = ''
  subdomain: string = ''
  slug: string = ''
  minDifficulty: number = 0
  maxDifficulty: number = 0
  timeLimit: number = 0

  static fromHtml (subdomain: string, slug: string, html: string): Problem {
    const $ = load(html)

    const problem = new Problem()

    const difficulty = parseRange(getDifficultyString($('main')))

    if (!statementHasEssentialMetaData($('.metadata_list').first().text())) {
      throw new Error(`Problem "${slug}" was not loaded correctly`)
    }

    problem.statement = heuristicCleanStatement($('#instructions-container'))
    problem.subdomain = subdomain
    problem.slug = slug
    problem.timeLimit = parseTimeLimit($('.metadata_list-item').first().find('span').last().text())
    problem.minDifficulty = difficulty.min
    problem.maxDifficulty = difficulty.max

    return problem
  }
}
