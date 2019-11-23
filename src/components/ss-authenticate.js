import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import { generateRandomString, getHashParams } from '../../helpers/utils'
import config from '../../config'
import './ss-button'

/**
 * This is the app's authentication component. It fires an
 * `authentication-approved` event once the user grants authorization.
 * @extends LitElement
 */
export class SSAuthenticate extends LitElement {
  static get styles () {
    return [
      GlobalStyles,
      css`

      `
    ]
  }

  constructor () {
    super()
    this._stateKey = 'spotify_auth_state'
  }

  render () {
    return html`
    <ss-button
      .label=${'Log in with Spotify'}
      .icon=${'person'}
      @click=${this._authenticate}>
    </ss-button>
    `
  }

  firstUpdated () {
    this._verifySession()
  }

  _authenticate () {
    const clientId = config.SPOTIFY_CLIENT_ID // Your client id
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
      this.dispatchEvent(new CustomEvent('authentication-error'))
    } else {
      localStorage.removeItem(this._stateKey)
      if (accessToken) {
        this.dispatchEvent(new CustomEvent('authentication-approved'))
      }
    }
  }
}

window.customElements.define('ss-authenticate', SSAuthenticate)
