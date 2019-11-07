import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from './styles/global-styles'

import { githubRepo } from './components/github-repo'
import './components/ss-authenticate'
import './components/ss-file-select'

export class SpotifyScanner extends LitElement {
  static get properties () {
    return {
      _authenticationError: { type: Boolean },
      session: { type: Boolean }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
      #authenticationError {
        position: absolute;
        display: grid;
        align-items: center;
        bottom: 0;
        height: 60px;
        width: 100%;
        text-align: center;
        color: var(--app-light-text-color);
        background-color: var(--app-error);
      }
      `
    ]
  }

  constructor () {
    super()
    this._authenticationError = false
    this.session = false
  }

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
      <ss-file-select></ss-file-select>
    `
  }

  _renderError () {
    return html`
      <div id="authenticationError">
        An error occurred during the authentification process.
      </div>
    `
  }

  _authenticationApprovedHandler () {
    this.session = true
  }

  _authenticationErrorHandler () {
    this._authenticationError = true
  }
}

window.customElements.define('spotify-scanner', SpotifyScanner)
