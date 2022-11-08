import { fetchBuilder, FileSystemCache } from 'node-fetch-cache'

const fetch = fetchBuilder.withCache(new FileSystemCache({}))

export const getHtml = async url => {
  const res = await fetch(url)
  return res.text()
}
