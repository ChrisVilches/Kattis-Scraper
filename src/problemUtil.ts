import { AnyNode, Cheerio } from 'cheerio'
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
