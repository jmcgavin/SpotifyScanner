import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'
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
        span {
          display: flex;
          align-items: center;
          height: 32px;
          box-sizing: border-box;
          padding: 0 6px;
          background-color: var(--app-white);
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        ss-checkbox {
          place-self: center;
        }

        /* Borders */
        span:not(#status):not(#firstCell):not(.lastRow) {
          border-bottom: solid 1px var(--app-light-border);
        }
        span:not(#status):not(#firstCell):not(.lastCol) {
          border-right: solid 1px var(--app-light-border);
        }

        /* Status colours */
        #status {
          grid-row-start: 1;
          grid-row-end: 4;
          height: 100%;
          box-sizing: border-box;
        }
        #status, #firstCell {
          background-color: var(--app-green);
        }
        :host([warning]) #status,
        :host([warning]) #firstCell {
          background-color: var(--app-warning);
        }
        :host([error]) #status,
        :host([error]) #firstCell {
          background-color: var(--app-red);
        }
        :host(:not([error])) input {
          cursor: pointer;
        }

        #firstCell {
          padding: 0 6px 0 0;
          display: grid;
        }
        .header {
          color: var(--app-medium-text);
        }
        .lastCol {
          justify-content: flex-end;
        }
        #noResult {
          color: var(--app-medium-text);
          grid-column-start: 3;
          grid-column-end: 7;
        }
        p {
          margin: 0;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
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
      `
    ]
  }

  constructor () {
    super()
    this.localTrack = {}
    this.spotifyResult = {}
  }

  render () {
    return html`
      <span id="status"></span>

      <span id="firstCell">
        <ss-checkbox
          ?disabled=${this.error}
          ?checked="${!this.error & !this.warning}"
          @change=${this._toggleSelection}>
        </ss-checkbox>
      </span>
      <span class="header">Title</span>
      <span class="header">Artist</span>
      <span class="header">Album</span>
      <span class="header lastCol"><p>Year</p></span>

      <span><p>Local</p></span>
      <span><p>${this.localTrack.title ? this.localTrack.title : ''}</p></span>
      <span><p>${this.localTrack.artist ? this.localTrack.artist : ''}</p></span>
      <span><p>${this.localTrack.album ? this.localTrack.album : ''}</p></span>
      <span class="lastCol"><p>${this.localTrack.year ? this.localTrack.year : ''}</p></span>


      <span class="lastRow">
        ${this.spotifyResult ? html`
          <a href="${this.spotifyResult.external_urls.spotify}" title="Open track in Spotify" target="_blank">Spotify</a>
        ` : 'Spotify'}
      </span>

      ${this.spotifyResult ? html`
        <span class="lastRow"><p>${this.spotifyResult ? this.spotifyResult.name : ''}</p></span>
        <span class="lastRow"><p>${this.spotifyResult ? spotifyArtistsArrayToString(this.spotifyResult.artists, ', ') : ''}</p></span>
        <span class="lastRow"><p>${this.spotifyResult ? this.spotifyResult.album.name : ''}</p></span>
        <span class="lastRow lastCol"><p>${this.spotifyResult ? this.spotifyResult.album.release_date.slice(0, 4) : ''}</p></span>
      ` : html`
        <span id="noResult">No result</span>
      `}

    `
  }

  _toggleSelection () {
    this.dispatchEvent(new CustomEvent('toggle-selection'))
  }
}

window.customElements.define('ss-result-card', SSResultCard)
