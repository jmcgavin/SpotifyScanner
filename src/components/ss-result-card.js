import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'
import { success, error, openNewWindow, warning } from './ss-icons'
import { spotifyArtistsArrayToString } from '../helpers/spotify'

import './ss-checkbox'

/**
 * Handles the file selection portion of the application.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSResultCard extends LitElement {
  static get properties () {
    return {
      localTrack: { type: Object },
      spotifyResult: { type: Object },
      warning: { type: Boolean, reflect: true },
      error: { type: Boolean, reflect: true }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: grid;
          grid-template-columns: 6px max-content repeat(3, 1fr) max-content;
          border-radius: 3px;
          font-size: 12px;
          overflow: hidden;
          box-shadow: 0px 4px 7px 2px rgba(0,0,0,0.3);
        }
        section:nth-child(n+3) {
          border-left: solid 1px var(--app-light-border);
        }
        section span:first-child {
          color: var(--app-medium-text);
        }
        section span:not(:last-child) {
          border-bottom: solid 1px var(--app-light-border);
        }
        span {
          display: flex;
          align-items: center;
          height: 32px;
          box-sizing: border-box;
          padding: 6px;
          background-color: var(--app-white);
        }
        div {
          display: flex;
          height: calc(100% - 32px);
          align-items: center;
          justify-content: center;
          color: var(--app-medium-text);
          background-color: var(--app-white);
        }
        :host(:not([error])) input {
          cursor: pointer;
        }
        svg {
          width: 20px;
          justify-self: end;
        }
        a {
          color: var(--app-medium-text);
          text-decoration: none;
        }
        a:hover {
          text-decoration: underline;
        }
        #status {
          background-color: var(--app-green);
        }
        #labels span:first-child {
          background-color: var(--app-green);
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 0 6px 0 0;
        }
        #labels span:first-child input {
          margin: 0;
        }
        :host([warning]) #status,
        :host([warning]) #labels span:first-child {
          background-color: var(--app-warning);
        }
        :host([error]) #status,
        :host([error]) #labels span:first-child {
          background-color: var(--app-red);
        }
        #labels {
          color: var(--app-medium-text);
        }
        #labels span:first-child {
          padding-left: 0;
        }
        #labels span:not(:first-child),
        #labels span:not(:last-child) {
          border-bottom: solid 1px var(--app-light-border);
        }
        #year {
          text-alight: right;
        }
      `
    ]
  }

  get _checkbox () {
    return this.renderRoot.querySelector('input')
  }

  constructor () {
    super()
    this.localTrack = {}
    this.spotifyResult = {}
  }

  render () {
    return html`
      <section id="status"></section>

      <section id="labels">
        <span>
          <input
            type="checkbox"
            ?disabled=${this.error}
            ?checked="${!this.error & !this.warning}"
            @change=${this._toggleSelection}/>
          ${this.error ? error : this.warning ? warning : success}
        </span>
        <span>Local</span>
        <span>
          <a href="${this.spotifyResult.external_urls.spotify}" title="Open track in Spotify" target="_blank">Spotify</a>
        </span>
      </section>

      <section id="track">
        <span>Track</span>
        <span>${this.localTrack.title ? this.localTrack.title : ''}</span>
        <span>${this.spotifyResult ? this.spotifyResult.name : ''}</span>
      </section>

      <section id="artist">
        <span>Artist</span>
        <span>${this.localTrack.artist ? this.localTrack.artist : ''}</span>
        <span>${this.spotifyResult ? spotifyArtistsArrayToString(this.spotifyResult.artists, ', ') : ''}</span>
      </section>

      <section id="album">
        <span>Album</span>
        <span>${this.localTrack.album ? this.localTrack.album : ''}</span>
        <span>${this.spotifyResult ? this.spotifyResult.album.name : ''}</span>
      </section>

      <section id="year">
        <span>Year</span>
        <span>${this.localTrack.year ? this.localTrack.year : ''}</span>
        <span>${this.spotifyResult ? this.spotifyResult.album.release_date.slice(0, 4) : ''}</span>
      </section>
    `
  }

  _toggleSelection () {
    this.dispatchEvent(new CustomEvent('toggle-selection'))
  }
}

window.customElements.define('ss-result-card', SSResultCard)
