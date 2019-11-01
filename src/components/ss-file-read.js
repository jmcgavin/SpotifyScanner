import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import * as id3 from 'id3js'
import '@material/mwc-button'

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
  }

  render () {
    return html`
      <ss-button
      .label=${`Scan ${this.selectedFilesAmount} file${this.selectedFilesAmount > 1 ? 's' : ''}`}
      .icon=${'library_music'}
      @click=${this._handleReadFilesClick}>
    </ss-button>
    `
  }

  _handleReadFilesClick () {
    this._readFiles(this.selectedFiles[0])
  }

  async _readFiles () {
    for (let i = 0; i < this.selectedFiles.length; i++) {
      const file = this.selectedFiles[i]
      const tags = await id3.fromFile(file)
      console.log(tags)
      return tags
    }
  }
}

window.customElements.define('ss-file-read', SSFileRead)
