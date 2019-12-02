import { createQueryString, getHashParams } from './utils'
import { ENDPOINTS } from '../constants'

// https://developer.spotify.com/documentation/web-api/reference/search/search/
export const searchTrack = async (...args) => { // filteredArtist, filteredTitle
  let result
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
    result = data.tracks.items
  })
  return result
}

/**
 * Converts an array of artist object(s) to a string with artist name(s)
 * @param {array} artists Spotify artists array
 * @return {string} artist name(s)
 */
export const spotifyArtistsArrayToString = artists => {
  if (artists.length > 1) {
    const combinedArtists = []
    for (let i = 0; i < artists.length; i++) {
      combinedArtists.push(artists[i].name)
    }
    return combinedArtists.join(' ')
  } else {
    return artists[0].name
  }
}
