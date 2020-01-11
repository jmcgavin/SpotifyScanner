import { LitElement, html, css } from 'lit-element'
import { GlobalStyles } from '../styles/global-styles'

import { getPlaylists } from '../helpers/spotify'
import { success } from '../components/ss-icons'

import './ss-result-card'
import './ss-dropdown'

/**
 * Handles the file selection portion of the application.
 * @extends LitElement
 * @prop {Boolean} _session - Is user connected to Spotify?
 */
export class SSResults extends LitElement {
  static get properties () {
    return {
      localTracks: { type: Array },
      selectedTracks: { type: Array },
      spotifyResults: { type: Array },
      playlists: { type: Array },
      opened: { type: Boolean, reflect: true },
      _selectedIndex: { type: Number },
      _selectedPlaylist: { type: Object }
    }
  }

  static get styles () {
    return [
      GlobalStyles,
      css`
        :host {
          display: block;
          width: 100%;
        }
        #buttonCon {
          display: grid;
          grid-template-columns: max-content auto;
          margin-bottom: 20px;
        }
        #buttonCon ss-button {
          align-self: end;
          width: fit-content;
        }
        #fileSelectButton {
          --background-color: var(--app-blue);
          margin-right: 16px;
        }
        #buttonCon h2 {
          font-family: Roboto, sans-serif;
          font-size: 14px;
          font-weight: normal;
          align-self: end;
          margin: 0;
          justify-self: end;
          color: var(--app-light-text);
          padding-right: 8px;
        }

        .wrapper {
          display: grid;
          font-family: Roboto, sans-serif;
          grid-template-columns: auto max-content;
          grid-template-rows: 12px 16px;
          grid-template-areas:
              "label label"
              "title arrow";
          align-items: center;
          gap: 6px 0;
          padding: 4px 8px;
          height: 40px;
          box-sizing: border-box;
          cursor: pointer;
          outline: none;
          width: 100%;
          border-radius: 3px;
          transition: 100ms background-color ease;
        }
        .wrapper p {
          font-size: 11px;
          margin: 0;
          grid-area: label;
          color: var(--app-neutral-400);
        }
        .wrapper h2 {
          color: var(--app-light-text-color);
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          font-size: 14px;
          font-weight: bold;
          text-transform: uppercase;
          margin: 0;
          grid-area: title;
        }
        .wrapper svg {
          transform: rotate(0deg);
          transition: transform .2s ease;
          will-change: transform;
          grid-area: arrow;
        }
        .wrapper:focus, .wrapper:hover {
          background-color: var(--app-header-light-color);
          transition: background-color 100ms;
        }
        hc-menu[opened] .wrapper svg {
          transform: rotate(180deg);
        }
        *[slot="item"] {
          transition: none;
          width: 100%;
        }
        button[slot="item"] svg {
          margin-right: 8px;
          height: auto;
          width: 20px;
          fill: var(--app-neutral-1000);
        }
        button[slot="item"][selected] svg {
          fill: var(--app-neutral-0);
        }
        ss-dropdown[opened] .wrapper svg:nth-of-type(2) {
          transform: rotate(180deg);
        }
      `
    ]
  }

  constructor () {
    super()
    this.tracks = []
    this.resultInnacuracyThreshold = 0.2
    this.selectedTracks = []
    this.spotifyResults = []
    this.playlists = [1, 2, 3, 4, 5]
    this._selectedPlaylist = {}
  }

  render () {
    return html`
      <div id="buttonCon">

        <ss-dropdown @opened-changed=${this._openedChanged}>
          <slot>
            <div
             class="wrapper"
             tabindex="0">
              ${success}
              <h2>${this._selectedPlaylist}</h2>
              ${success}
            </div>
          </slot>
          <p slot="item">Playlist</p>
          ${this.playlists.map(playlist => html`
            <button
              slot="item"
              ?selected="${playlist === this._selectedPlaylist}"
              tabindex="${this.opened ? '0' : '-1'}"
              @click="${() => this._onMenuItemClicked(playlist)}">
              ${success}
              ${playlist}
            </button>
          `)}
        </ss-dropdown>
        
        <ss-button
          .label=${'Add to Spotify'}
          .icon=${'library_add'}
          @click=${this._handleFileSelect}
          id="fileSelectButton">
        </ss-button>
        <h2>${this.selectedTracks.length} of ${this.spotifyResults.length}</h2>
      </div>
      ${this.spotifyResults.map((result, index) => html`
        <ss-result-card
          .localTrack=${this.localTracks[index]}
          .spotifyResult=${result.track}
          ?warning=${result.averagedDifference > this.resultInnacuracyThreshold}
          ?error=${!result.track}
          @toggle-selection=${() => this._toggleSelection(index)}>
        </ss-result-card>
      `)}
    `
  }

  firstUpdated () {
    this._selectTracks()
  }

  _selectTracks () {
    for (let i = 0; i < this.spotifyResults.length; i++) {
      if (this.spotifyResults[i].averagedDifference < this.resultInnacuracyThreshold) {
        this.spotifyResults[i] = {
          ...this.spotifyResults[i],
          selected: true
        }
      } else {
        this.spotifyResults[i] = {
          ...this.spotifyResults[i],
          selected: false
        }
      }
    }
    console.log(this.spotifyResults)
    this._updateSelected()
  }

  _toggleSelection (index) {
    this.spotifyResults[index].selected
      ? this.spotifyResults[index].selected = false
      : this.spotifyResults[index].selected = true
    this._updateSelected()
  }

  _updateSelected () {
    const selected = this.spotifyResults.filter(result => result.selected === true)
    this.selectedTracks = selected
  }

  _onMenuItemClicked (index) {
    this.selectedIndex = index
  }

  _openedChanged (e) {
    this.opened = e.detail
  }
}

window.customElements.define('ss-results', SSResults)
