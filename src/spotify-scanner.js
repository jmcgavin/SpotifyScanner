import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from './styles/global-styles'

import { githubRepo } from './components/github-repo'
import './components/ss-file-select'
import './components/ss-login'
import '@material/mwc-button'

export class SpotifyScanner extends LitElement {
  static get properties () {
    return {
      session: { type: Boolean },
      _authenticationError: { type: Boolean }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
      :host {
        width: 100vw;
        height: 100vh;
      }
      .gridContainer {
        height: 100%;
        width: 100%;
        display: grid;
        justify-content: center;
        align-content: center;
      }
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
    this.session = false
    this._authenticationError = false
  }

  render () {
    return html`
      ${githubRepo}
      <div class="gridContainer">
        ${!this.session ? this._renderLogin() : this._renderMain()}
      </div>
      ${this._authenticationError ? html`${this._renderError()}` : ''}
    `
  }

  _renderLogin () {
    return html`
      <ss-login
        @login-approved="${this.loginApproved}">
      </ss-login>
    `
  }

  _renderMain () {
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

  loginApproved () {
    this.session = true
  }
}

window.customElements.define('spotify-scanner', SpotifyScanner)
