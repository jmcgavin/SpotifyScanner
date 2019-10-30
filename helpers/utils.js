/**
 * Generates a random string containing numbers and letters
 * @param  {number} The length of the string
 * @return {string} The generated string
 */
export const generateRandomString = length => {
  let text = ''
  const possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  for (var i = 0; i < length; i++) {
    text += possible.charAt(Math.floor(Math.random() * possible.length))
  }
  return text
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
