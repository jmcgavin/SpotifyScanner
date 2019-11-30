import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from './styles/global-styles'

import { githubRepo } from './components/github-repo'
import './components/ss-authenticate'
import './components/ss-file-select'

export class SpotifyScanner extends LitElement {
  static get properties () {
    return {
      _authenticationError: { type: Boolean },
      session: { type: Boolean },
      tracks: { type: Array }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        ss-authenticate {
          transform: translate(-50%, -50%);
          position: absolute;
          top: 50%;
          left: 50%;
        }
        #authenticationError {
          position: absolute;
          display: grid;
          align-items: center;
          bottom: 0;
          height: 60px;
          width: 100%;
          text-align: center;
          color: var(--app-light-text);
          background-color: var(--app-error);
        }
      `
    ]
  }

  get _fileSelector () {
    return this.renderRoot.querySelector('ss-file-select')
  }

  constructor () {
    super()
    this._authenticationError = false
    this.session = false
    this.tracks = []
  }

  // ${!this.session ? this._renderAuthenticate() : this._renderFileSelect()}
  // or
  // ${this._renderFileSelect()}
  render () {
    return html`
      ${githubRepo}
      ${!this.session ? this._renderAuthenticate() : this._renderFileSelect()}
      ${this._authenticationError ? this._renderError() : ''}
    `
  }

  _renderAuthenticate () {
    return html`
      <ss-authenticate
        @authentication-error="${this._authenticationErrorHandler}"
        @authentication-approved="${this._authenticationApprovedHandler}">
      </ss-authenticate>
    `
  }

  _renderFileSelect () {
    return html`
      <ss-file-select
        @tracks-selected="${this._filesSelectedHandler}">
      </ss-file-select>
    `
  }

  _renderError () {
    return html`
      <div id="authenticationError">
        An error occurred during the authentification process.
      </div>
    `
  }

  _filesSelectedHandler (e) {
    this.tracks = e.detail
    // console.timeEnd('_readFiles timer')
  }

  _authenticationApprovedHandler () {
    this.session = true
  }

  _authenticationErrorHandler () {
    this._authenticationError = true
  }
}

window.customElements.define('spotify-scanner', SpotifyScanner)
