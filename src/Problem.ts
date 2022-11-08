import { strip } from './strip'
import { AnyNode, Cheerio, load } from 'cheerio'
import { parseRange, getDifficultyString, parseTimeLimit, statementHasEssentialMetaData } from './problemUtil'

const KATTIS_PROBLEM_STATEMENT_SELECTOR = '#instructions-container'

/**
 * Attempts to remove some of the information and leave only the problem statement description.
 */
const heuristicCleanStatement = ($: Cheerio<AnyNode>): string => {
  const $container = load($.html() as string)
  $container('#instructions-close').remove()
  $container('.attribute_list-item').remove()

  return strip($container.text())
}

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

    try {
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
    } catch (e) {
      console.error(`Error found in problem "${slug}"`)
      throw e
    }
  }
}
