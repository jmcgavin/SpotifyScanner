import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-file-read'
import '@material/mwc-button'

/**
 * Main description for the component goes here.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSFileSelect extends LitElement {
  static get properties () {
    return {
      selectedFilesAmount: { type: Number },
      selectedFiles: { type: Object }
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
      /* Hide input element */
      input {
        position: absolute;
        width: 1px;
        height: 1px;
        padding: 0;
        margin: -1px;
        overflow: hidden;
        clip: rect(0,0,0,0);
        border: 0;
      }
      mwc-button {
        --mdc-theme-primary: var(--spotify-green);
        --mdc-theme-on-primary: var(--app-light-text-color);
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
    this.selectedFilesAmount = 0
  }

  render () {
    return html`
      <input
        @change="${this._updateSelectedFiles}"
        type="file"
        accept="audio/*"
        multiple>
        
      <mwc-button
        @click=${this._handleFileSelect}
        label="Select files"
        icon="attach_file"
        id="fileSelectButton"
        dense
        raised>
      </mwc-button>

      ${this.selectedFilesAmount > 0 ? html`
        <ss-file-read
          .selectedFiles="${this.selectedFiles}"
          .selectedFilesAmount="${this.selectedFilesAmount}">
        </ss-file-read>
      ` : ''}
    `
  }

  _handleFileSelect () {
    this._fileSelectInput.click()
  }

  _updateSelectedFiles () {
    this.selectedFilesAmount = this._fileSelectInput.files.length
    this.selectedFiles = this._fileSelectInput.files
  }
}

window.customElements.define('ss-file-select', SSFileSelect)
