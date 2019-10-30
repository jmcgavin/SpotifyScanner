import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import { fileReader } from '../../helpers/files'
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
      #fileReadButton {
        --mdc-theme-primary: var(--app-white);
        --mdc-theme-on-primary: var(--spotify-green);
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
      <mwc-button
        @click=${this._readFiles}
        label="Scan ${this.selectedFilesAmount} file${this.selectedFilesAmount > 1 ? 's' : ''}"
        icon="cloud_select"
        id="fileReadButton"
        dense
        raised>
      </mwc-button>
    `
  }

  _readFiles () {
    console.log(this.selectedFiles)
  }
}

window.customElements.define('ss-file-read', SSFileRead)
