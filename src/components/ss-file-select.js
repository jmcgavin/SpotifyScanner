import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

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
        <h2>Total: ${this.tracks.length}</h2>
      </div>

      <ss-table
        .tracks="${this.tracks}"
        ?tracks-selected=${this.tracksAreSelected}>
      </ss-table>
    `
  }

  _readFiles () {
    if (this._fileSelectInput.files.length) {
      const fileArray = Array.from(this._fileSelectInput.files)

      window.Promise.map(fileArray, file => {
        return new Promise((resolve, reject) => {
          window.jsmediatags.read(file, {
            onSuccess: resolve,
            onError: error => {
              console.log(error.message)
              reject(error)
            }
          })
        })
      }, { concurrency: 5 }).then(tags => {
        const results = tags.map((tag, index) => ({
          id: index + 1,
          title: tag.tags.title || undefined,
          artist: tag.tags.artist || undefined,
          album: tag.tags.album || undefined,
          year: tag.tags.year || undefined
        }))
        this.tracks = results
        this.dispatchEvent(new CustomEvent('tracks-selected', {
          detail: this.tracks
        }))
        this._enableSearchButton()
      }, error => {
        console.log(error.message)
      })
    }
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
