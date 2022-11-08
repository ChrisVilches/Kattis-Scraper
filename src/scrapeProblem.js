import { strip } from './strip.js'
import { load } from 'cheerio'
import { getHtml } from './getHtml.js'

const TIMELIMIT_REGEX = /^[0-9]+ seconds?$/
const KATTIS_PROBLEM_STATEMENT_SELECTOR = '#instructions-container'
const KATTIS_PROBLEM_DIFFICULTY_SELECTOR = '.difficulty_number'

const parseTimeLimit = str => {
  if (!TIMELIMIT_REGEX.test(str)) {
    throw new Error('Timelimit string has an unexpected format')
  }

  return +str.split(' ')[0]
}

const difficultyToRange = str => {
  if (str.includes('-')) {
    const value = str.split('-').map(s => +s)
    return {
      min: value[0],
      max: value[1]
    }
  }

  return {
    min: +str,
    max: +str
  }
}

const getDifficulty = html => {
  const $ = load(html)
  return $(KATTIS_PROBLEM_DIFFICULTY_SELECTOR).html().trim()
}

/**
 * Checks whether the full problem statement (including metadata) is valid, i.e. it contains time limit and other data.
 * This function should be used to check that the page was scraped correctly.
 */
const problemStatementHasEssentialMetaData = problemStatement => problemStatement.includes('CPU Time limit') && problemStatement.includes('Memory limit')

/**
 * Attempts to remove some of the information and leave only the problem statement description.
 */
const heuristicCleanStatement = $ => {
  $.find('#instructions-close').remove()
  $.find('.attribute_list-item').remove()

  return strip($.text())
}

// TODO: Must handle 404 error as well.
export const scrapeProblem = async (subdomain, slug) => {
  const pageHtml = await getHtml(`https://${subdomain}.kattis.com/problems/${slug}`)

  // TODO: Refactor this?
  // The purpose of this is to have a cloned one that can have some elements removed.
  // A better way would be to pass a copy of $ to each function so that there are no effects.
  // (or copy $ inside each function)
  const $ = load(pageHtml)
  const $mutable = load(pageHtml)

  const fullProblemStatement = strip($(KATTIS_PROBLEM_STATEMENT_SELECTOR).text())
  const cleanProblemStatement = heuristicCleanStatement($mutable(KATTIS_PROBLEM_STATEMENT_SELECTOR))

  // TODO: Make this function simpler, move some of the logic to other functions.

  try {
    const timeLimit = parseTimeLimit($('.attribute_list-item').first().find('span').last().text())

    const difficulty = difficultyToRange(getDifficulty(pageHtml))

    if (!problemStatementHasEssentialMetaData(fullProblemStatement)) {
      throw new Error(`Problem "${slug}" was not loaded correctly`)
    }

    return {
      slug,
      minDifficulty: difficulty.min,
      maxDifficulty: difficulty.max,
      timeLimit,
      problemStatement: cleanProblemStatement
    }
  } catch (e) {
    console.error(`Error found in problem "${slug}"`)
    throw e
  }
}
