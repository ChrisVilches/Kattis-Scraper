const STRIP_REGEX = /[ \t]+/g

export const strip = (str: string): string => str.split('\n').map(line => line.replace(STRIP_REGEX, ' ').trim()).filter(line => line.length).join('\n')
