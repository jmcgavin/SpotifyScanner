import { createQueryString, getHashParams } from './utils'
import { ENDPOINTS } from '../constants'
import stringDifferential from '../scripts/leven'

// https://developer.spotify.com/documentation/web-api/reference/search/search/
export const searchTrack = async (...args) => { // filteredArtist, filteredTitle
  const accessToken = getHashParams().access_token
  const searchQuery = args.join(' ')
  const queryString = createQueryString({
    q: searchQuery,
    type: 'track',
    limit: 5,
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
      const levenshteinDistance = stringDifferential(
        `${searchQuery}`,
        `${data.tracks.items[0].artists[0].name} ${data.tracks.items[0].name}`
      )
      console.log(`%cFound: %c${data.tracks.items[0].artists[0].name} - ${data.tracks.items[0].name} %c(${levenshteinDistance})`,
        'color: #1DB954;',
        'color: default;',
        `${levenshteinDistance >= 50 ? 'color: #F2545B;' : levenshteinDistance >= 25 ? 'color: #F9CB40;' : 'color: #1DB954;'}`
      )
    } else {
      console.log(`%cNo results: %c${searchQuery}`, 'color: #F2545B;', 'color: default;')
    }
  })
}
