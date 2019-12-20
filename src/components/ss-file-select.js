import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'
import { removeFromString } from '../helpers/utils'
import levenshteinDifference from '../../scripts/leven'

import { searchTrack, spotifyArtistsArrayToString } from '../helpers/spotify'

import './ss-button'
import './ss-results'
import './ss-table'

/**
 * Handles the file selection portion of the application.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSFileSelect extends LitElement {
  static get properties () {
    return {
      tracks: { type: Array },
      spotifyResults: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: grid;
          height: fit-content;
          width: 90%;
          max-width: 900px;
          justify-self: center;
          grid-template-rows: auto auto;
          grid-gap: 16px;
        }
        #textContainer {
          width: 100%;
          margin-bottom: 60px;
        }
        #textContainer h2 {
          color: var(--app-green);
          font-weight: bold;
          font-size: 60px;
          margin: 0;
        }
        #textContainer p {
          color: var(--app-light-text);
          margin: 0;
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
    this.resultInnacuracyLowerWarningThreshold = 0.4
    this.resultInnacuracyUpperWarningThreshold = 0.55
    this.spotifyResults = []
  }

  render () {
    return html`
      <section id="textContainer">
        <h2>Select songs</h2>
        <p>Some text will go here. I'll make sure to write enough that the space gets filled up nicely</p>
      </section>

      ${this.spotifyResults.length ? html`
        <ss-results
          .localTracks=${this.tracks}
          .spotifyResults=${this.spotifyResults}>
        </ss-results>
      ` : html`
        <input
          @change="${this._readFiles}"
          type="file"
          accept="audio/*"
          multiple>

        <section id="buttonCon">
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
          <h2>${this.tracks.length}</h2>
        </section>
        <ss-table
          .tracks=${this.tracks}
          .spotifyResults=${this.spotifyResults}
          ?tracks-selected=${this.tracks.length}>
        </ss-table>
      `}
    `
  }

  async _searchSpotify () {
    const results = []
    for (let i = 0; i < this.tracks.length; i++) {
      const localTrack = this.tracks[i]
      const filteredArtist = removeFromString({
        string: localTrack.artist,
        regEx: /\sfeaturing|\sfeat|\sft|\svs|\sand|\s&|,|\./gi,
        normalizeWhitespace: true
      })
      const filteredTitle = removeFromString({
        string: localTrack.title,
        regEx: /\s\(.*?\)/g,
        normalizeWhitespace: true
      })
      const searchTerms = {
        filteredArtist,
        filteredTitle
      }

      await searchTrack(filteredArtist, filteredTitle).then(searchResults => {
        return this._findBestResult(localTrack, searchResults, searchTerms)
      }).then(result => {
        results.push(result || {})
      })
    }
    this.spotifyResults = results
    console.log(this.spotifyResults)
    // console.log('done')
  }

  /**
   * Narrow down a list of search results and select the most likely result.
   * @param {object} localTrack The track being searched
   * @param {array} searchResults Search results
   * @param {object} searchTerms Strings used in the search query
   */
  _findBestResult (localTrack, searchResults, searchTerms) {
    const similarityComparisons = []
    let averagedDifference

    for (let i = 0; i < searchResults.length; i++) {
      const artistOnSpotify = spotifyArtistsArrayToString(searchResults[i].artists).toLowerCase()
      const titleOnSpotify = searchResults[i].name.toLowerCase()
      const albumOnSpotify = searchResults[i].album.name.toLowerCase()

      const localArtist = localTrack.album ? localTrack.artist.toLowerCase() : ''
      const localTitle = localTrack.album ? localTrack.title.toLowerCase() : ''
      const localAlbum = localTrack.album ? localTrack.album.toLowerCase() : ''

      const artistDifference = (levenshteinDifference(localArtist, artistOnSpotify)) / artistOnSpotify.length
      const titleDifference = (levenshteinDifference(localTitle, titleOnSpotify)) / titleOnSpotify.length
      const albumDifference = (levenshteinDifference(localAlbum, albumOnSpotify)) / albumOnSpotify.length

      averagedDifference = (artistDifference + titleDifference) / 2

      similarityComparisons.push({
        originalIndex: i,
        averagedDifference,
        albumDifference
      })
    }
    similarityComparisons.sort((a, b) => {
      return a.averagedDifference - b.averagedDifference || a.albumDifference - b.albumDifference
    })

    // console.log(similarityComparisons)
    // console.log(searchResults)

    const result = Array.isArray(searchResults) && searchResults.length ? {
      track: searchResults[similarityComparisons[0].originalIndex],
      averagedDifference: similarityComparisons[0].averagedDifference
    } : null

    return result
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
      id: index,
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
