import { AnyNode, Cheerio, load } from 'cheerio'
import { Problem } from './Problem'
import { strip } from './strip'

const TIMELIMIT_REGEX = /.*CPU Time limit\s*([0-9]+)\s+seconds?.*/
const DIFFICULTY_REGEX_ONE = /([0-9]+\.[0-9]+)\s*Difficulty/
const DIFFICULTY_REGEX_TWO = /([0-9]+\.[0-9]+\s*-\s*[0-9]+\.[0-9]+)\s*Difficulty/

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
    throw new Error("Couldn't parse timelimit")
  }

  return Number(match[1])
}

export const getDifficultyString = (str: string): string => {
  const match = str.match(DIFFICULTY_REGEX_TWO)?.at(1) ?? str.match(DIFFICULTY_REGEX_ONE)?.at(1) ?? ''

  if (match === '') {
    throw new Error("Couldn't parse difficulty")
  }

  return match
}

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
