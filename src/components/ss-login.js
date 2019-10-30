import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import { generateRandomString, getHashParams } from '../../helpers/utils'
import '@material/mwc-button'

/**
 * This is the app's login component. It fires a `login-approved` event once Spotify authorizes the user.
 * @extends LitElement
 */
export class SSLogin extends LitElement {
  static get styles () {
    return [
      GlobalStyles,
      css`
      mwc-button {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        --mdc-theme-primary: var(--spotify-green);
        --mdc-theme-on-primary: var(--app-light-text-color));
      }
      `
    ]
  }

  constructor () {
    super()
    this._stateKey = 'spotify_auth_state'
  }

  render () {
    return html`
      <mwc-button
        @click=${this._login}
        label="Log in with Spotify"
        icon="person"
        dense
        raised>
      </mwc-button>
    `
  }

  firstUpdated () {
    this._verifySession()
  }

  _login () {
    const clientId = 'bb4d5dbdf5714a15b1803f54d1a3c1e8' // Your client id
    const redirectUri = 'http://localhost:8000/callback' // Your redirect uri
    const scope = 'user-read-private playlist-modify-private'
    const state = generateRandomString(16)

    localStorage.setItem(this._stateKey, state)

    var url = 'https://accounts.spotify.com/authorize'
    url += '?response_type=token'
    url += '&client_id=' + encodeURIComponent(clientId)
    url += '&scope=' + encodeURIComponent(scope)
    url += '&redirect_uri=' + encodeURIComponent(redirectUri)
    url += '&state=' + encodeURIComponent(state)
    // url += '&show_dialog=' + encodeURIComponent('true')

    window.location = url
  }

  _verifySession () {
    const params = getHashParams()
    const accessToken = params.access_token
    const state = params.state
    const storedState = localStorage.getItem(this._stateKey)

    if (accessToken && (state === null || state !== storedState)) {
      this._authenticationError = true
    } else {
      localStorage.removeItem(this._stateKey)
      if (accessToken) {
        this.dispatchEvent(new CustomEvent('login-approved'))
      }
    }
  }
}

window.customElements.define('ss-login', SSLogin)
