import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-button'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSFileRead extends LitElement {
  static get properties () {
    return {
      selectedFiles: { type: Object },
      selectedFilesAmount: { type: Number },
      tracks: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
      :host {
        display: grid;
        width: auto;
        height: fit-content;
      }
      ss-button {
        --background-color: var(--app-white);
        --color: var(--spotify-green);
      }
      `
    ]
  }

  constructor () {
    super()
    this.selectedFiles = {}
    this.selectedFilesAmount = 0
    this.tracks = []
  }

  render () {
    return html`
      <ss-button
        .label=${`Scan ${this.selectedFilesAmount} file${this.selectedFilesAmount > 1 ? 's' : ''}`}
        .icon=${'library_music'}
        @click=${this._readFiles}>
      </ss-button>
    `
  }

  _readFiles () {
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
    console.log(tracks)
    // console.timeEnd('_readFiles() duration')
  }
}

window.customElements.define('ss-file-read', SSFileRead)
