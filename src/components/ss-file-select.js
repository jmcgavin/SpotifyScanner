import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'
import { removeFromString } from '../../helpers/utils'
import levenshteinDifference from '../../scripts/leven'

import { searchTrack, spotifyArtistsArrayToString } from '../../helpers/spotify'

import './ss-table'
import './ss-button'
import './ss-spinner'

/**
 * Handles the file selection portion of the application.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSFileSelect extends LitElement {
  static get properties () {
    return {
      tracks: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: grid;
          width: 90%;
          margin: 0 auto;
          grid-template-rows: auto auto;
          grid-gap: 16px;
        }
        input {
          display: none;
        }
        #buttonCon {
          display: grid;
          grid-template-columns: max-content max-content auto;
        }
        #buttonCon ss-button {
          align-self: end;
          width: fit-content;
        }
        #fileSelectButton {
          --background-color: var(--app-blue);
          margin-right: 16px;
        }
        #buttonCon h2 {
          font-family: Roboto, sans-serif;
          font-size: 14px;
          font-weight: normal;
          align-self: end;
          margin: 0;
          justify-self: end;
          color: var(--app-light-text);
          padding-right: 8px;
        }
      `
    ]
  }

  get _fileSelectInput () {
    return this.renderRoot.querySelector('input')
  }

  get _table () {
    return this.renderRoot.querySelector('ss-table')
  }

  constructor () {
    super()
    this.tracks = []
  }

  render () {
    return html`
      <input
        @change="${this._readFiles}"
        type="file"
        accept="audio/*"
        multiple>

      <div id="buttonCon">
        <ss-button
          .label=${'Select files'}
          .icon=${'library_music'}
          @click=${this._handleFileSelect}
          id="fileSelectButton">
        </ss-button>
        <ss-button
          ?disabled=${!this.tracks.length}
          .label=${'Search Spotify'}
          .icon=${'search'}
          @click=${this._searchSpotify}
          id="spotifySearchButton">
        </ss-button>
        <h2>Total: ${this.tracks.length}</h2>
      </div>

      <ss-table
        .tracks="${this.tracks}"
        ?tracks-selected=${this.tracks.length}>
      </ss-table>
    `
  }

  async _searchSpotify () {
    for (let i = 0; i < this.tracks.length; i++) {
      const localTrack = this.tracks[i]
      const filteredArtist = removeFromString({
        string: localTrack.artist,
        regEx: /\sfeaturing|\sfeat|\sft|\svs|\sand|\s&|,|\./gi,
        normalizeWhitespace: true
      })
      const filteredTitle = removeFromString({
        string: localTrack.title,
        regEx: /\s\(Original|\s\(Official|\s\(Extended|\s\(Radio|\s\(Pro|\s\(DJ|\sBootleg\)|\sMix\)|\sEdit\)|\(|\)/gi,
        normalizeWhitespace: true
      })
      await searchTrack(filteredArtist, filteredTitle).then(result => {
        this._selectSpotifyResult(localTrack, result)
      })
    }
  }

  _findBestResult (localTrack, searchResult) {
    const similarityArray = []
    let similarityIndex

    for (let i = 0; i < searchResult.length; i++) {
      const filteredLocalArtist = removeFromString({
        string: localTrack.artist || '',
        regEx: /\sfeaturing|\sfeat|\sft|\svs|\sand|\s&|,|\./gi,
        normalizeWhitespace: true
      })
      const filteredLocalTitle = removeFromString({
        string: localTrack.title || '',
        regEx: /\s\(Original|\s\(Official|\s\(Extended|\s\(Radio|\s\(Pro|\s\(DJ|\sBootleg\)|\sMix\)|\sEdit\)|\(|\)/gi,
        normalizeWhitespace: true
      })

      const artistOnSpotify = spotifyArtistsArrayToString(searchResult[i].artists).toLowerCase()
      const titleOnSpotify = searchResult[i].name.toLowerCase()
      const albumOnSpotify = searchResult[i].album.name.toLowerCase()

      const localAlbum = localTrack.album ? localTrack.album.toLowerCase() : ''

      const artistDifference = (levenshteinDifference(filteredLocalArtist, artistOnSpotify)) / artistOnSpotify.length
      const titleDifference = (levenshteinDifference(filteredLocalTitle, titleOnSpotify)) / titleOnSpotify.length
      const albumDifference = (levenshteinDifference(localAlbum, albumOnSpotify)) / albumOnSpotify.length
      const spotifyPopularity = searchResult[i].popularity

      similarityIndex = (artistDifference + titleDifference) / 2

      similarityArray.push({
        originalIndex: i,
        similarityIndex,
        albumDifference,
        spotifyPopularity
      })
      similarityArray.sort((a, b) => {
        if (a.similarityIndex > b.similarityIndex) return 1 // sort lowest to highest similarityIndex 
        if (a.similarityIndex < b.similarityIndex) return -1
        if (a.albumDifference > b.albumDifference) return 1 // sort lowest to highest albumDifference 
        if (a.albumDifference < b.albumDifference) return -1
        if (a.spotifyPopularity > b.spotifyPopularity) return -1 // sort highest to lowest spotifyPopularity
        if (a.spotifyPopularity < b.spotifyPopularity) return 1
      })
    }
    // console.log(similarityArray)
    return {
      index: similarityArray[0].originalIndex,
      difference: similarityArray[0].similarityIndex
    }
  }

  _selectSpotifyResult (localTrack, searchResult) {
    // console.log(searchResult)
    // console.log(localTrack)

    if (searchResult.length) {
      const result = this._findBestResult(localTrack, searchResult)
      const topResult = searchResult[result.index]
      const topRestultArtist = spotifyArtistsArrayToString(topResult.artists)
      const topResultTitle = topResult.name
      const topResultDifference = result.difference

      // console.log(searchResult[topResult])
      console.groupCollapsed(`%cResult found %c(${topResultDifference} difference)`,
        'color: #1DB954;',
        `${topResultDifference >= 0.6 ? 'color: #F2545B;' : topResultDifference >= 0.4 ? 'color: #F9CB40;' : 'color: #1DB954;'}`
      )
      console.log(`Spotify: ${topRestultArtist} - ${topResultTitle}`)
      console.log(`Local: ${localTrack.artist} - ${localTrack.title}`)
      console.groupEnd()
    } else {
      console.log(`%cNo results: %c${localTrack.artist} ${localTrack.title}`, 'color: #F2545B;', 'color: default;')
    }
  }

  _readFiles () {
    const fileArray = Array.from(this._fileSelectInput.files)
    const promises = []

    if (fileArray.length) {
      for (const file of fileArray) {
        promises.push(new Promise((resolve, reject) => {
          window.jsmediatags.read(file, {
            onSuccess: (tags) => {
              resolve(tags)
            },
            onError: (error) => {
              console.log(error.message)
              reject(error)
            }
          })
        }))
      }
      this._returnTags(promises)
    }
  }

  async _returnTags (promiseArray) {
    // console.time('_readFiles timer')
    await window.Promise.map(promiseArray, (tags, index) => ({
      id: index + 1,
      title: tags.tags.title || undefined,
      artist: tags.tags.artist || undefined,
      album: tags.tags.album || undefined,
      year: tags.tags.year || undefined
    }), {
      concurrency: 5
    }).then(tracks => {
      this.tracks = tracks
      this.dispatchEvent(new CustomEvent('tracks-selected', {
        detail: this.tracks
      }))
    }, error => {
      console.log(error.message)
    })
  }

  _handleFileSelect () {
    this._fileSelectInput.click()
  }
}

window.customElements.define('ss-file-select', SSFileSelect)
