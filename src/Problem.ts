import { strip } from './strip'
import { load } from 'cheerio'
import { parseRange, getDifficultyString, parseTimeLimit, statementHasEssentialMetaData, heuristicCleanStatement } from './problemUtil'

const KATTIS_PROBLEM_STATEMENT_SELECTOR = '#instructions-container'

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

    const fullStatement = strip($(KATTIS_PROBLEM_STATEMENT_SELECTOR).text())

    const difficulty = parseRange(getDifficultyString($(KATTIS_PROBLEM_STATEMENT_SELECTOR)))

    if (!statementHasEssentialMetaData(fullStatement)) {
      throw new Error(`Problem "${slug}" was not loaded correctly`)
    }

    problem.statement = heuristicCleanStatement($(KATTIS_PROBLEM_STATEMENT_SELECTOR))
    problem.subdomain = subdomain
    problem.slug = slug
    problem.timeLimit = parseTimeLimit($('.attribute_list-item').first().find('span').last().text())
    problem.minDifficulty = difficulty.min
    problem.maxDifficulty = difficulty.max

    return problem
  }
}
