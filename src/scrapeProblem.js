import { strip } from './strip.js'
import { load } from 'cheerio'
import { getHtml } from './getHtml.js'
import { parseRange } from './parseRange.js'

const TIMELIMIT_REGEX = /^[0-9]+ seconds?$/
const KATTIS_PROBLEM_STATEMENT_SELECTOR = '#instructions-container'
const KATTIS_PROBLEM_DIFFICULTY_SELECTOR = '.difficulty_number'

const parseTimeLimit = str => {
  if (!TIMELIMIT_REGEX.test(str)) {
    throw new Error('Timelimit string has an unexpected format')
  }

  return +str.split(' ')[0]
}

const getDifficultyString = $ => $.find(KATTIS_PROBLEM_DIFFICULTY_SELECTOR).text().trim()

/**
 * Checks whether the full problem statement (including metadata) is valid, i.e. it contains time limit and other data.
 * This function should be used to check that the page was scraped correctly.
 */
const statementHasEssentialMetaData = statement => statement.includes('CPU Time limit') && statement.includes('Memory limit')

/**
 * Attempts to remove some of the information and leave only the problem statement description.
 */
const heuristicCleanStatement = $ => {
  $ = load($.html())
  $('#instructions-close').remove()
  $('.attribute_list-item').remove()

  return strip($.text())
}

export const scrapeProblem = async (subdomain, slug) => {
  const pageHtml = await getHtml(`https://${subdomain}.kattis.com/problems/${slug}`)

  const $ = load(pageHtml)

  const fullStatement = strip($(KATTIS_PROBLEM_STATEMENT_SELECTOR).text())
  const cleanStatement = heuristicCleanStatement($(KATTIS_PROBLEM_STATEMENT_SELECTOR))

  try {
    const timeLimit = parseTimeLimit($('.attribute_list-item').first().find('span').last().text())

    const difficulty = parseRange(getDifficultyString($(KATTIS_PROBLEM_STATEMENT_SELECTOR)))

    if (!statementHasEssentialMetaData(fullStatement)) {
      throw new Error(`Problem "${slug}" was not loaded correctly`)
    }

    return {
      slug,
      minDifficulty: difficulty.min,
      maxDifficulty: difficulty.max,
      timeLimit,
      statement: cleanStatement
    }
  } catch (e) {
    console.error(`Error found in problem "${slug}"`)
    throw e
  }
}
