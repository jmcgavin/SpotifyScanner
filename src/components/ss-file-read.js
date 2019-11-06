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
      selectedFilesAmount: { type: Number }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
      :host {
        display: grid;
        width: fit-content;
        height: fit-content;
        grid-template-rows: 1fr 1fr;
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
    this.jsmediatags = window.jsmediatags
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
    console.time('_readFiles() duration')
    for (let i = 0; i < this.selectedFiles.length; i++) {
      this.jsmediatags.read(this.selectedFiles[i], {
        onSuccess: file => {
          console.log(`${i + 1}. ${file.tags.artist} - ${file.tags.title}`)
        },
        onError: error => {
          console.log(error)
        }
      })
    }
    console.timeEnd('_readFiles() duration')
  }
}

window.customElements.define('ss-file-read', SSFileRead)
