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
          max-width: 900px;
          grid-template-columns: 6px max-content 1fr 0.8fr 1fr max-content;
          border-radius: 3px;
          font-size: 12px;
          overflow: hidden;
          box-shadow: 0px 4px 7px 2px rgba(0,0,0,0.3);
        }
        section {
          overflow: hidden;
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
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        p {
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        :host(:not([error])) input {
          cursor: pointer;
        }
        svg {
          width: 20px;
          justify-self: end;
        }
        a {
          color: var(--app-blue);
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
        <span><p>Local</p></span>
        <span>
          ${this.spotifyResult ? html`
            <a href="${this.spotifyResult.external_urls.spotify}" title="Open track in Spotify" target="_blank">Spotify</a>
          ` : 'Spotify'}
        </span>
      </section>

      <section id="track">
        <span><p>Track</p></span>
        <span><p>${this.localTrack.title ? this.localTrack.title : ''}</p></span>
        <span><p>${this.spotifyResult ? this.spotifyResult.name : ''}</p></span>
      </section>

      <section id="artist">
        <span><p>Artist</p></span>
        <span><p>${this.localTrack.artist ? this.localTrack.artist : ''}</p></span>
        <span><p>${this.spotifyResult ? spotifyArtistsArrayToString(this.spotifyResult.artists, ', ') : ''}</p></span>
      </section>

      <section id="album">
        <span><p>Album</p></span>
        <span><p>${this.localTrack.album ? this.localTrack.album : ''}</p></span>
        <span><p>${this.spotifyResult ? this.spotifyResult.album.name : ''}</p></span>
      </section>

      <section id="year">
        <span><p>Year</p></span>
        <span><p>${this.localTrack.year ? this.localTrack.year : ''}</p></span>
        <span><p>${this.spotifyResult ? this.spotifyResult.album.release_date.slice(0, 4) : ''}</p></span>
      </section>
    `
  }

  _toggleSelection () {
    this.dispatchEvent(new CustomEvent('toggle-selection'))
  }
}

window.customElements.define('ss-result-card', SSResultCard)
