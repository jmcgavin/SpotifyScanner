import { createQueryString, getHashParams } from './utils'
import { ENDPOINTS } from '../constants'

// https://developer.spotify.com/documentation/web-api/reference/search/search/
export const searchTrack = async (...args) => {
  const accessToken = getHashParams().access_token
  const searchQuery = args.join(' ')
  const queryString = createQueryString({
    q: searchQuery,
    type: 'track',
    limit: 10,
    market: 'from_token'
  })

  await fetch(`${ENDPOINTS.search}?${queryString}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${accessToken}`
    }
  }).then(response => {
    return response.json()
  }).then(data => {
    if (data.tracks.items.length) {
      console.log(`%cFound: %c${data.tracks.items[0].artists[0].name} - ${data.tracks.items[0].name}`,
        'color: #1DB954;', 'color: default;'
      )
    } else {
      console.log(`%cNo results: %c${searchQuery}`, 'color: #F2545B;', 'color: default;')
    }
  })
}
