export const parseRange = str => {
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
