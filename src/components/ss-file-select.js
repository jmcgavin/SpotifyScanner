import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'
import { removeFromString } from '../helpers/utils'
import levenshteinDifference from '../../scripts/leven'

import { searchTrack, spotifyArtistsArrayToString } from '../helpers/spotify'

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
    this.resultInnacuracyLowerWarningThreshold = 0.4
    this.resultInnacuracyUpperWarningThreshold = 0.55
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
        regEx: /\s\(.*?\)/g,
        normalizeWhitespace: true
      })
      const searchTerms = {
        filteredArtist,
        filteredTitle
      }

      await searchTrack(filteredArtist, filteredTitle).then(searchResults => {
        this._findBestResult(localTrack, searchResults, searchTerms)
      })
    }
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

    const topResult = Array.isArray(searchResults) && searchResults.length ? {
      track: searchResults[similarityComparisons[0].originalIndex],
      averagedDifference: similarityComparisons[0].averagedDifference
    } : null

    this._selectTopResult(localTrack, topResult, searchTerms)
  }

  _selectTopResult (localTrack, topResult, searchTerms) {
    // console.log(topResult)
    // console.log(localTrack)

    if (topResult) {
      const topRestultArtist = spotifyArtistsArrayToString(topResult.track.artists, ', ')
      const topResultTitle = topResult.track.name
      const topResultDifference = parseFloat(topResult.averagedDifference.toFixed(3))

      console.groupCollapsed(`%cResult found%c: ${topRestultArtist} - ${topResultTitle} %c(${topResultDifference} difference)`,
        'color: #1DB954;', 'color: default;',
      `${topResultDifference >= this.resultInnacuracyUpperWarningThreshold ? 'color: #F2545B;'
        : topResultDifference >= this.resultInnacuracyLowerWarningThreshold ? 'color: #F9CB40;'
        : 'color: #1DB954;'}`
      )
      console.log(`%cSpotify%c: ${topRestultArtist} - ${topResultTitle}`, 'color: #1DB954;', 'color: default')
      console.log(`%cLocal%c: ${localTrack.artist} - ${localTrack.title}`, 'color: #30BCED;', 'color: default;')
      console.log(`%cSearch term%c: ${searchTerms.filteredArtist} ${searchTerms.filteredTitle}`, 'color: #7494EA;', 'color: default;')
      console.groupEnd()
    } else {
      console.groupCollapsed(`%cNo results for%c: ${localTrack.artist} - ${localTrack.title}`, 'color: #F2545B;', 'color: default;')
      console.log(`%cSearch term%c: ${searchTerms.filteredArtist} ${searchTerms.filteredTitle}`, 'color: #7494EA;', 'color: default;')
      console.groupEnd()
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
