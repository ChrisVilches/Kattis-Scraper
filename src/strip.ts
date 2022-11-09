const STRIP_REGEX = /[ \t]+/g

/**
 * Cleans a string, removes extra white space and empty lines.
 */
export const strip = (str: string): string => str.split('\n').map(line => line.replace(STRIP_REGEX, ' ').trim()).filter(line => line.length).join('\n')
