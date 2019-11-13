import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import * as Promise from 'bluebird'

import './ss-table'
import './ss-button'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSFileSelect extends LitElement {
  static get properties () {
    return {
      tracksAreSelected: { type: Boolean },
      tracks: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: grid;
          height: 100%;
          width: 90%;
          margin: 0 auto;
          grid-template-rows: 20vh 70vh;
          grid-gap: 16px;
        }
        input {
          display: none;
        }
        #buttonCon {
          display: flex;
        }
        #buttonCon ss-button {
          align-self: flex-end;
        }
        #fileSelectButton {
          --background-color: var(--app-blue);
          margin-right: 16px;
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
    this.tracksAreSelected = false
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
          ?disabled=${!this.tracksAreSelected}
          .label=${'Search Spotify'}
          .icon=${'search'}
          id="spotifySearchButton">
        </ss-button>
      </div>

      <ss-table
        .tracks="${this.tracks}"
        ?tracks-selected=${this.tracksAreSelected}>
      </ss-table>
    `
  }

  _readFiles () {
    const fileArray = Array.from(this._fileSelectInput.files)
    const promises = fileArray.map((file, index) => {
      return new Promise((resolve, reject) => {
        window.jsmediatags.read(file, {
          onSuccess: (fileTags) => {
            this.tracks.push({
              id: index + 1,
              title: fileTags.tags.title || '',
              artist: fileTags.tags.artist || '',
              album: fileTags.tags.album || '',
              year: fileTags.tags.year || ''
            })
            this.tracks.sort((a, b) => a.id - b.id)
            resolve(fileTags)
          },
          onError: (error) => {
            console.log('Error')
            reject(error)
          }
        })
      })
    })

    Promise.all(promises).then(() => {
      // this.dispatchEvent(new CustomEvent('tracks-selected', {
      //   detail: this.tracks
      // }))
      this._enableSearchButton()
      // console.log(this.tracks)
    })
  }

  _updateSelectedTracks () {

  }

  _enableSearchButton () {
    if (this.tracks.length) {
      this.tracksAreSelected = true
    }
  }

  _handleFileSelect () {
    this._fileSelectInput.click()
  }
}

window.customElements.define('ss-file-select', SSFileSelect)
