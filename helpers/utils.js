/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = length => {
  let randomString = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (let i = 0; i < length; i++) {
    randomString += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return randomString
}

/**
 * Obtains parameters from the hash of the URL
 * @return {object} Hash parameters
 */
export const getHashParams = () => {
  const hashParams = {}
  let e = /([^&;=]+)=?([^&;]*)/g
  const r = /([^&;=]+)=?([^&;]*)/g
  const q = window.location.hash.substring(1)
  while ((e = r.exec(q))) {
    hashParams[e[1]] = decodeURIComponent(e[2])
  }
  return hashParams
}

/**
 * Creates an array of arrays of a specified length
 * @param  {array} array Array to be chunked
 * @param  {number} chunkSize Chunk size
 * @return {array} Chunked array
 */
export const chunkArray = (array, chunkSize) => {
  const chunkedArray = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunkedArray.push(array.slice(i, i + chunkSize))
  }
  return chunkedArray
}

/**
 * Joins an object's key-value pair(s) to form parameters of a query string
 * @param {object} params Query parameters
 * @return {string} Query string
 */
export const createQueryString = (params = {}) => {
  const queryString = Object.keys(params)
    .map(key => encodeURIComponent(key) + '=' + encodeURIComponent(params[key]))
    .join('&')
  return queryString
}

/**
 * Removes characters from a string
 * @param {string} string String to be modified
 * @param {regEx} regEx Regular expression that string will be checked against
 * @return {string} New string
 */
export const removeFromString = ({ string, regEx, normalizeWhitespace = false }) => {
  const result = string.replace(regEx, '')
  if (normalizeWhitespace) {
    result.replace(/\w([ ]{2,})\w/, '')
  }
  return result
}
