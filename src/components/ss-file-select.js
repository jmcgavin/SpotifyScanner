import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import './ss-file-read'
import './ss-button'

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
        width: auto;
        height: fit-content;
      }
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
    this.selectedFilesAmount = 0
  }

  render () {
    return html`
      <input
        @change="${this._updateSelectedFiles}"
        type="file"
        accept="audio/*"
        multiple>

      <ss-button
        .label=${'Select files'}
        .icon=${'attach_file'}
        @click=${this._handleFileSelect}>
      </ss-button>

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
