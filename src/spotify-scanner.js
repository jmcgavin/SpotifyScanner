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
        :host {
          display: grid;
          grid-template-rows: min-content 1fr 40px;
        }
        #gitHub {
          place-self: end;
        }
        ss-authenticate {
          place-self: center;
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
        footer {
          font-familiy: Roboto, sans-serif;
          width: 100%;
          font-size: 12px;
          color: var(--app-light-text);
          place-content: center;
          place-items: center;
          display: flex;
          height: 100%;
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
      <span id="gitHub">${githubRepo}</span>
      ${!this.session ? this._renderAuthenticate() : this._renderFileSelect()}
      ${this._authenticationError ? this._renderError() : ''}
      <footer>
        Made with &hearts; by Jordan
      </footer>
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
