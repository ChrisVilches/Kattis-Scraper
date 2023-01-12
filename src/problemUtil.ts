import { AnyNode, Cheerio, load } from 'cheerio'
import { Problem } from './Problem'
import { strip } from './strip'
const TIMELIMIT_REGEX = /^\s*([0-9]+)\s+seconds?\s*$/i
const KATTIS_PROBLEM_DIFFICULTY_SELECTOR = '.difficulty_number'

interface Range {
  min: number
  max: number
}

export const parseRange = (str: string): Range => {
  if (str.includes('-')) {
    const value = str.split('-').map(s => +s)
    return {
      min: Math.min(...value),
      max: Math.max(...value)
    }
  }

  return {
    min: +str,
    max: +str
  }
}

export const parseTimeLimit = (str: string): number => {
  const match = str.match(TIMELIMIT_REGEX)

  if (match === null) {
    throw new Error('Timelimit string has an unexpected format')
  }

  return Number(match[1])
}

export const getDifficultyString = ($: Cheerio<AnyNode>): string => $.find(KATTIS_PROBLEM_DIFFICULTY_SELECTOR).text().trim()

/**
 * Checks whether the full problem statement (including metadata) is valid, i.e. it contains time limit and other data.
 * This function should be used to check that the page was scraped correctly.
 */
export const statementHasEssentialMetaData = (statement: string): boolean => statement.includes('CPU Time limit') && statement.includes('Memory limit')

/**
 * Attempts to remove some of the information and leave only the problem statement description.
 */
export const heuristicCleanStatement = ($: Cheerio<AnyNode>): string => {
  const $container = load($.html() as string)
  $container('#instructions-close').remove()
  $container('.attribute_list-item').remove()

  return strip($container.text())
}

export const problemDebugPreview = (problem: Problem): string => {
  const contentPreview = `${problem.statement.substring(0, 20)}...${problem.statement.substring(problem.statement.length - 20, Infinity)}`.replace(/\n/g, ' ')
  return `${problem.subdomain}/${problem.slug}\t\t${problem.timeLimit} seconds\t\tDifficulty ${problem.minDifficulty} - ${problem.maxDifficulty}\t\t${contentPreview}`
}
