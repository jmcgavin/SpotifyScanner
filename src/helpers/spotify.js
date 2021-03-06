import { createQueryString, getHashParams } from './utils'
import { ENDPOINTS } from '../../constants'

/**
 * Search for a track on Spotify
 * https://developer.spotify.com/documentation/web-api/reference/search/search/
 * @param  {...any} args Strings to be passed into search query
 * @return {array} result Array of search results
 */
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

  try {
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
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get the user's Spotify playlists
 * https://developer.spotify.com/documentation/web-api/reference/playlists/
 * @return {array} result Array of user's playlists
 */
export const getPlaylists = async () => {
  let result
  const accessToken = getHashParams().access_token

  try {
    await fetch(`${ENDPOINTS.playlists}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json()
    }).then(data => {
      result = data.items
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Get the active user
 * https://developer.spotify.com/documentation/web-api/reference/users-profile/get-current-users-profile/
 * @return {object} result User object
 */
export const getUser = async () => {
  let result
  const accessToken = getHashParams().access_token

  try {
    await fetch(`${ENDPOINTS.user}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    }).then(response => {
      return response.json()
    }).then(data => {
      result = data
    })
    return result
  } catch (error) {
    throw new Error(error)
  }
}

/**
 * Converts an array of artist object(s) to a string with artist name(s)
 * @param {array} artists Spotify artists array
 * @param {string} separator Character(s) that will separate each artist
 * @return {string} artist name(s)
 */
export const spotifyArtistsArrayToString = (artists, separator = ' ') => {
  if (artists.length > 1) {
    const combinedArtists = []
    for (let i = 0; i < artists.length; i++) {
      combinedArtists.push(artists[i].name)
    }
    return combinedArtists.join(separator)
  } else {
    return artists[0].name
  }
}
