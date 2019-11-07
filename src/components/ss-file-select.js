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
      selectedFiles: { type: Object },
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
    this.selectedFiles = {}
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

  _handleFileSelect () {
    this._fileSelectInput.click()
  }

  _readFiles () {
    this.selectedFiles = this._fileSelectInput.files
    const { selectedFiles, tracks } = this
    // console.time('_readFiles() duration')
    for (let i = 0; i < selectedFiles.length; i++) {
      window.jsmediatags.read(selectedFiles[i], {
        onSuccess: file => {
          tracks.push({
            id: i + 1,
            title: file.tags.title || '',
            artist: file.tags.artist || '',
            album: file.tags.album || '',
            year: file.tags.year || ''
          })
          tracks.sort((a, b) => a.id - b.id)
        },
        onError: error => {
          console.log(error)
        }
      })
    }
    this.dispatchEvent(new CustomEvent('tracks-selected', {
      detail: tracks
    }))
    // console.timeEnd('_readFiles() duration')
  }
}

window.customElements.define('ss-file-select', SSFileSelect)
