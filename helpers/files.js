/**
 * Generates a random string containing numbers and letters
 * @param  {number} length The length of the string
 * @return {string} The generated string
 */
export const fileReader = (file) => {
  const fileReader = new FileReader()

  fileReader.onload = function (e) {
    console.log('loaded')
    console.log(fileReader.readAsText(file))
  }
}
