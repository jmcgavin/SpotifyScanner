import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-button'

/**
 * Main description for the component goes here.
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
        input {
          display: none;
        }
      `
    ]
  }

  get _fileSelectInput () {
    return this.renderRoot.querySelector('input')
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

      <ss-button
        .label=${'Select files to scan'}
        .icon=${'library_music'}
        @click=${this._handleFileSelect}>
      </ss-button>
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
      this.dispatchEvent(new CustomEvent('tracks-selected', {
        detail: this.tracks
      }))
    })
  }

  _handleFileSelect () {
    this._fileSelectInput.click()
  }
}

window.customElements.define('ss-file-select', SSFileSelect)
