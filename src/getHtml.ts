// @ts-expect-error
import { fetchBuilder, FileSystemCache } from 'node-fetch-cache'

const fetch = fetchBuilder.withCache(new FileSystemCache({}))

export const getHtml = async (url: string): Promise<string> => {
  const res = await fetch(url)
  return res.text()
}
